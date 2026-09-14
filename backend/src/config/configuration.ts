export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  mongoUri: string;
  corsOrigin: string;
  jwt: {
    accessSecret: string;
    accessTtl: string;
    refreshSecret: string;
    refreshTtl: string;
  };
  throttle: {
    ttl: number;
    limit: number;
    authLimit: number;
  };
  storage: {
    driver: 'local' | 'cloudinary';
    localDir: string;
    publicBaseUrl: string;
    maxUploadMb: number;
    cloudinary: {
      cloudName?: string;
      apiKey?: string;
      apiSecret?: string;
    };
  };
  seed: {
    adminEmail: string;
    adminPassword: string;
  };
  mail: {
    user?: string;
    pass?: string;
    from?: string;
  };
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.BACKEND_PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  mongoUri:
    process.env.MONGO_URI ??
    'mongodb://admin:changeme@localhost:27017/lmc_db?authSource=admin',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
    // Per visitor IP. The home page alone makes ~12 requests.
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '120', 10),
    authLimit: parseInt(process.env.AUTH_THROTTLE_LIMIT ?? '5', 10),
  },
  storage: {
    driver: (process.env.STORAGE_DRIVER as 'local' | 'cloudinary') ?? 'local',
    localDir: process.env.STORAGE_LOCAL_DIR ?? './uploads',
    publicBaseUrl:
      process.env.STORAGE_PUBLIC_BASE_URL ?? 'http://localhost:3000/uploads',
    maxUploadMb: parseInt(process.env.MAX_UPLOAD_MB ?? '5', 10),
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  },
  seed: {
    adminEmail: process.env.SEED_ADMIN_EMAIL ?? 'hassan@gmail.com',
    adminPassword: process.env.SEED_ADMIN_PASSWORD ?? '12345678',
  },
  mail: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
});
