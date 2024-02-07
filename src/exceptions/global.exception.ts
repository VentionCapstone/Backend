import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponseOptions } from 'src/common/types/ErrorResponseOptions';
import ErrorsTypes from 'src/errors/errors.enum';

export class GlobalException extends HttpException {
  constructor(
    key: ErrorsTypes,
    message?: string,
    statusCode?: number,
    options?: ErrorResponseOptions
  ) {
    super({ key, message, options }, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
