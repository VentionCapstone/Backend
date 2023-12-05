import { HttpException, HttpStatus } from '@nestjs/common';

export class GlobalException extends HttpException {
  constructor(key: string) {
    super(key, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
