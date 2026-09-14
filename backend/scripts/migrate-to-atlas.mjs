/**
 * Copy every collection from one MongoDB deployment to another.
 *
 *   node scripts/migrate-to-atlas.mjs --from <SOURCE_URI> --to <TARGET_URI> [options]
 *
 * Options:
 *   --dry-run   report what would be copied, write nothing
 *   --drop      drop each target collection before copying (destructive)
 *   --batch N   documents per insert (default 500)
 *
 * Documents keep their original _id, so the migration is repeatable: re-running
 * without --drop skips duplicates instead of creating them. Indexes are copied
 * too, because Mongoose only guarantees the ones its schemas declare.
 *
 * Example — local dev DB to Atlas:
 *   node scripts/migrate-to-atlas.mjs \
 *     --from "mongodb://127.0.0.1:27017/lmc_db" \
 *     --to   "mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/lmc_db?retryWrites=true&w=majority"
 */
import { MongoClient } from 'mongodb';

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  if (v === undefined || v.startsWith('--')) return true;
  return v;
}

const fromUri = arg('from');
const toUri = arg('to');
const dryRun = arg('dry-run', false) === true;
const drop = arg('drop', false) === true;
const batchSize = Number(arg('batch', 500)) || 500;

if (!fromUri || !toUri || fromUri === true || toUri === true) {
  console.error('Usage: node scripts/migrate-to-atlas.mjs --from <URI> --to <URI> [--dry-run] [--drop] [--batch N]');
  process.exit(1);
}
if (fromUri === toUri) {
  console.error('Refusing to run: --from and --to are identical.');
  process.exit(1);
}

// A URI without a database path lands on "test" — almost never what you want.
for (const [label, uri] of [['--from', fromUri], ['--to', toUri]]) {
  const path = uri.split('?')[0].split('/').slice(3).join('/');
  if (!path) {
    console.error(`Refusing to run: ${label} has no database name in its path (it would use "test"). Add /lmc_db before the "?".`);
    process.exit(1);
  }
}

const redact = (u) => u.replace(/\/\/[^@]*@/, '//***:***@');

const src = new MongoClient(fromUri);
const dst = new MongoClient(toUri);

try {
  console.log(`source: ${redact(fromUri)}`);
  console.log(`target: ${redact(toUri)}`);
  console.log(dryRun ? 'mode:   DRY RUN (nothing is written)\n' : `mode:   ${drop ? 'DROP + COPY' : 'COPY (skip existing _id)'}\n`);

  await src.connect();
  await dst.connect();

  const srcDb = src.db();
  const dstDb = dst.db();

  const collections = (await srcDb.listCollections().toArray())
    .filter((c) => c.type !== 'view' && !c.name.startsWith('system.'))
    .map((c) => c.name)
    .sort();

  if (collections.length === 0) {
    console.log('Source has no collections — nothing to do.');
  }

  let totalCopied = 0;
  let totalSkipped = 0;

  for (const name of collections) {
    const srcCol = srcDb.collection(name);
    const dstCol = dstDb.collection(name);
    const count = await srcCol.countDocuments();
    const existing = await dstCol.countDocuments().catch(() => 0);

    if (dryRun) {
      console.log(`  ${name}: ${count} docs in source, ${existing} already in target`);
      continue;
    }

    if (drop && existing > 0) {
      await dstCol.drop().catch(() => {});
      console.log(`  ${name}: dropped target collection`);
    }

    let copied = 0;
    let skipped = 0;
    let batch = [];

    const flush = async () => {
      if (batch.length === 0) return;
      try {
        const res = await dstCol.insertMany(batch, { ordered: false });
        copied += res.insertedCount;
      } catch (err) {
        // Duplicate _id means the document is already there — expected on re-runs.
        const dupes = (err.writeErrors ?? []).filter((e) => e.code === 11000).length;
        const other = (err.writeErrors ?? []).filter((e) => e.code !== 11000);
        copied += err.result?.insertedCount ?? batch.length - (err.writeErrors?.length ?? 0);
        skipped += dupes;
        if (other.length) throw new Error(`${name}: ${other[0].errmsg}`);
      }
      batch = [];
    };

    for await (const doc of srcCol.find({})) {
      batch.push(doc);
      if (batch.length >= batchSize) await flush();
    }
    await flush();

    // Recreate non-_id indexes so uniqueness constraints survive the move.
    let idx = 0;
    for (const spec of await srcCol.indexes()) {
      if (spec.name === '_id_') continue;
      const { key, name: iname, v, ns, background, ...opts } = spec;
      try {
        await dstCol.createIndex(key, { name: iname, ...opts });
        idx++;
      } catch (err) {
        console.log(`    ! index ${iname}: ${err.message}`);
      }
    }

    totalCopied += copied;
    totalSkipped += skipped;
    console.log(`  ${name}: copied ${copied}, skipped ${skipped} (already present), ${idx} index(es)`);
  }

  if (!dryRun) {
    console.log(`\nDone. ${totalCopied} document(s) copied, ${totalSkipped} skipped.`);
    console.log('Verify with:  --dry-run  (source and target counts should match)');
  }
} catch (err) {
  console.error(`\nMigration failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await src.close().catch(() => {});
  await dst.close().catch(() => {});
}
