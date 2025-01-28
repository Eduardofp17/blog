import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { BaseError } from './base.error';
import { Response } from 'express';
import { HttpError } from './http.error';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = 500;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal Server Error';

    switch (true) {
      case exception instanceof HttpError:
        statusCode = exception.statusCode;
        code = exception.code;
        message = exception.message;
        break;

      case exception instanceof BaseError:
        code = exception.code;
        message = exception.message;
        break;

      case exception instanceof HttpException:
        statusCode = exception.getStatus();
        message = exception.message;
        break;

      default:
        break;
    }

    response.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
