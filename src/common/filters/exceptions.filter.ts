import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiError } from '../../utils/api-error';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isDevelopment = process.env.NODE_ENV === 'development';

    let status: number;
    let errorResponse: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as
        | string
        | { message: string; statusCode: number };
      errorResponse =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : { ...exceptionResponse };
    } else if (exception instanceof ApiError) {
      status = exception.statusCode;
      errorResponse = {
        status: exception.status,
        message: exception.message,
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        status: 'error',
        message: 'Internal server error',
      };
    }

    if (isDevelopment) {
      errorResponse.stack = (exception as any).stack;
    }

    response.status(status).json({
      status: errorResponse.status || 'error',
      message: errorResponse.message,
      path: request.url,
      ...(isDevelopment && { stack: errorResponse.stack }),
    });
  }
}
