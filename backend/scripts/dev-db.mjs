/**
 * Local MongoDB for development (no Docker).
 *
 *   npm run db
 *
 * Runs mongod via mongodb-memory-server on localhost:27017 and keeps data in
 * backend/.mongo-data. The binary is downloaded on first run.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const dbPath = resolve(process.cwd(), '.mongo-data');
mkdirSync(dbPath, { recursive: true });

const server = await MongoMemoryServer.create({
  instance: {
    port: 27017,
    dbName: 'lmc_db',
    dbPath,
    storageEngine: 'wiredTiger',
  },
});

console.log(`\n  MongoDB (dev) ready:  ${server.getUri('lmc_db')}`);
console.log(`  data dir:             ${dbPath}`);
console.log('  keep this terminal open — Ctrl+C to stop\n');

const shutdown = async () => {
  console.log('\nstopping MongoDB (dev)...');
  await server.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
