import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const stack = exception.stack;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse() as any;
    let message = exceptionResponse.message;
    if (typeof message === 'string') {
      message = [{ message }];
    }

    // if error from inputs
    const validationErrors = message.map((error) => ({
      value: error.value,
      property: error.property,
      constraints: error.constraints,
    }));
    message = validationErrors;
    if (validationErrors.length == 1) {
      message = exceptionResponse.message;
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      message,
      stack: stack,
    });
  }
}
