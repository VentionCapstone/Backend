import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { isString } from 'class-validator';
import { Observable } from 'rxjs';

export class PhoneNumberTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.body && request.body.phoneNumber && isString(request.body.phoneNumber)) {
      request.body.phoneNumber = request.body.phoneNumber.replace(/[^\d)]/g, '');
      if (request.body.phoneNumber[0] !== '+') {
        request.body.phoneNumber = '+' + request.body.phoneNumber;
      }
    }
    return next.handle();
  }
}
