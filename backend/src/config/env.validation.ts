import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

class EnvVars {
  @IsOptional()
  @IsIn(['development', 'production', 'test'])
  NODE_ENV?: string;

  @IsOptional()
  @IsInt()
  BACKEND_PORT?: number;

  @IsString()
  MONGO_URI!: string;

  @IsOptional()
  @IsString()
  CORS_ORIGIN?: string;

  @IsString()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  JWT_REFRESH_SECRET!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvVars, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(
      `Invalid environment variables:\n${errors
        .map(
          (e) =>
            `  - ${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`,
        )
        .join('\n')}`,
    );
  }

  // Extra guard: refuse to boot production with weak / shared JWT secrets.
  if (config.NODE_ENV === 'production') {
    const weak: string[] = [];
    for (const key of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'] as const) {
      const raw = config[key];
      const v = typeof raw === 'string' ? raw : '';
      if (v.length < 32 || /dev|change|secret|example/i.test(v)) weak.push(key);
    }
    if (
      String(config.JWT_ACCESS_SECRET) === String(config.JWT_REFRESH_SECRET)
    ) {
      weak.push('JWT_ACCESS_SECRET === JWT_REFRESH_SECRET');
    }
    if (weak.length) {
      throw new Error(
        `Refusing to start in production with weak JWT secrets: ${weak.join(
          ', ',
        )}. Use 32+ random chars, distinct per token.`,
      );
    }
  }

  return config;
}
