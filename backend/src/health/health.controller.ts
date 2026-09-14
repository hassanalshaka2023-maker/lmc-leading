import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Connection } from 'mongoose';
import { Public } from '../common/decorators/public.decorator';

const MONGO_STATES = [
  'disconnected',
  'connected',
  'connecting',
  'disconnecting',
];

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liveness + database connectivity probe' })
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        db: 'connected',
        uptime: 12.34,
        timestamp: '2026-08-27T00:00:00.000Z',
      },
    },
  })
  check() {
    const dbState = MONGO_STATES[this.connection.readyState] ?? 'unknown';
    return {
      status: dbState === 'connected' ? 'ok' : 'degraded',
      db: dbState,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
