import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  const user = request.user;

  return data ? user && user[data] : user;
});
