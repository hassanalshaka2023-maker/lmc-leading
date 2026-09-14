import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

export interface StoredFile {
  url: string;
  storageKey: string;
  sizeBytes: number;
}

interface CloudinaryCreds {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/**
 * File storage abstraction with two drivers:
 * - `local`      — writes to disk and is served from /uploads (dev / VPS).
 * - `cloudinary` — uploads to Cloudinary; required on hosts with an ephemeral
 *   disk (Render free tier), where local files vanish on every restart.
 * Cloudinary is called through its REST API directly, so no SDK dependency.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger('Storage');
  private readonly baseDir: string;
  private readonly publicBaseUrl: string;
  private readonly cloudinary?: CloudinaryCreds;

  constructor(config: ConfigService) {
    this.baseDir = resolve(
      config.get<string>('storage.localDir') ?? './uploads',
    );
    this.publicBaseUrl = (
      config.get<string>('storage.publicBaseUrl') ??
      'http://localhost:3000/uploads'
    ).replace(/\/$/, '');

    if (config.get<string>('storage.driver') === 'cloudinary') {
      const creds = config.get<CloudinaryCreds>('storage.cloudinary');
      if (!creds?.cloudName || !creds.apiKey || !creds.apiSecret) {
        throw new Error(
          'STORAGE_DRIVER=cloudinary requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET',
        );
      }
      this.cloudinary = creds;
      this.logger.log(`Using Cloudinary storage (${creds.cloudName})`);
    }
  }

  async save(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<StoredFile> {
    const now = new Date();
    const yyyy = String(now.getUTCFullYear());
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');

    if (this.cloudinary) {
      return this.saveToCloudinary(
        buffer,
        mimeType,
        `lmc/${yyyy}/${mm}/${randomUUID()}`,
      );
    }

    const ext = (extname(originalName) || '').toLowerCase().slice(0, 12);
    const name = `${randomUUID()}${ext}`;
    const relDir = join(yyyy, mm);
    const storageKey = join(relDir, name).replace(/\\/g, '/');

    await mkdir(join(this.baseDir, relDir), { recursive: true });
    await writeFile(join(this.baseDir, storageKey), buffer);

    return {
      storageKey,
      url: `${this.publicBaseUrl}/${storageKey}`,
      sizeBytes: buffer.length,
    };
  }

  async delete(storageKey: string): Promise<void> {
    try {
      if (this.cloudinary) {
        const res = await this.cloudinaryRequest('destroy', {
          public_id: storageKey,
        });
        const body = (await res.json()) as { result?: string };
        if (body.result !== 'ok') throw new Error(JSON.stringify(body));
        return;
      }
      await unlink(join(this.baseDir, storageKey));
    } catch (err) {
      // Missing file on delete is not fatal — log and move on.
      this.logger.warn(`delete failed for ${storageKey}: ${String(err)}`);
    }
  }

  private async saveToCloudinary(
    buffer: Buffer,
    mimeType: string,
    publicId: string,
  ): Promise<StoredFile> {
    const file = new Blob([new Uint8Array(buffer)], { type: mimeType });
    const res = await this.cloudinaryRequest(
      'upload',
      { public_id: publicId },
      file,
    );
    const body = (await res.json()) as {
      secure_url?: string;
      public_id?: string;
      bytes?: number;
      error?: { message?: string };
    };
    if (!res.ok || !body.secure_url || !body.public_id) {
      throw new Error(
        `Cloudinary upload failed: ${body.error?.message ?? res.status}`,
      );
    }
    return {
      storageKey: body.public_id,
      url: body.secure_url,
      sizeBytes: body.bytes ?? buffer.length,
    };
  }

  /** Signed call to the Cloudinary image API (https://cloudinary.com/documentation/image_upload_api_reference). */
  private cloudinaryRequest(
    action: 'upload' | 'destroy',
    params: Record<string, string>,
    file?: Blob,
  ): Promise<Response> {
    const { cloudName, apiKey, apiSecret } = this.cloudinary!;
    const signed = {
      ...params,
      timestamp: String(Math.floor(Date.now() / 1000)),
    };
    const toSign = Object.keys(signed)
      .sort()
      .map((k) => `${k}=${signed[k as keyof typeof signed]}`)
      .join('&');
    const signature = createHash('sha1')
      .update(toSign + apiSecret)
      .digest('hex');

    const form = new FormData();
    for (const [k, v] of Object.entries(signed)) form.append(k, v);
    form.append('api_key', apiKey);
    form.append('signature', signature);
    if (file) form.append('file', file);

    return fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/${action}`,
      { method: 'POST', body: form },
    );
  }
}
