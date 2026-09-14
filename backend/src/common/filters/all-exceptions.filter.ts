import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

/** Uniform error envelope: { statusCode, error, message, path, timestamp }. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const b = body as Record<string, unknown>;
        message = (b.message as string | string[]) ?? exception.message;
        error = (b.error as string) ?? exception.name;
      }
    } else if (exception instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'ValidationError';
      message = Object.values(exception.errors).map((e) => e.message);
    } else if (
      exception instanceof MongooseError.CastError ||
      (exception as { name?: string })?.name === 'CastError'
    ) {
      status = HttpStatus.BAD_REQUEST;
      error = 'CastError';
      message = 'Malformed identifier';
    } else if ((exception as { code?: number })?.code === 11000) {
      status = HttpStatus.CONFLICT;
      error = 'DuplicateKey';
      message = 'A record with these unique values already exists';
    }

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.url}`,
        (exception as Error)?.stack ?? String(exception),
      );
    }

    res.status(status).json({
      statusCode: status,
      error,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
