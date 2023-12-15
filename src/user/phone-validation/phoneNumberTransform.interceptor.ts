import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class PhoneNumberTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.transformPhoneNumber(request);
    return next.handle();
  }

  private transformPhoneNumber(request: Request): void {
    const phoneNumber = request.body?.phoneNumber;
    if (phoneNumber && typeof phoneNumber === 'string') {
      request.body.phoneNumber = this.formatPhoneNumber(phoneNumber);
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    const cleanedNumber = phoneNumber.replace(/[^\d)]/g, '');
    return cleanedNumber.startsWith('+') ? cleanedNumber : `+${cleanedNumber}`;
  }
}
