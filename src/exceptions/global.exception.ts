import { HttpException, HttpStatus } from '@nestjs/common';
import ErrorsTypes from 'src/errors/errors.enum';

export class GlobalException extends HttpException {
  constructor(key: ErrorsTypes, message?: string) {
    super({ key, message }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
