import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CurrentUserType } from '../types/CurrentUser.type';

export const CurrentUser = createParamDecorator(
  (key: keyof CurrentUserType, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user: CurrentUserType = request.user;

    return key ? user && user[key] : user;
  }
);
