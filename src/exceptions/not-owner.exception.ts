import { HttpException, HttpStatus } from '@nestjs/common';

export class NotOwnerException extends HttpException {
  constructor() {
    super('You are not the owner of this accommodation', HttpStatus.UNAUTHORIZED);
  }
}
