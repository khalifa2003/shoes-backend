import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiError extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
