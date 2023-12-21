import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthUser } from '../types/AuthUser.type';

export const CurrentUser = createParamDecorator(
  (key: keyof AuthUser, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user: AuthUser = request.user;

    return key ? user && user[key] : user;
  }
);
