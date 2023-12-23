import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import ErrorsTypes from 'src/errors/errors.enum';

export const CookieGetter = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<string> => {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies[data];

    if (!refreshToken) throw new UnauthorizedException(ErrorsTypes.AUTH_TOKEN_NOT_FOUND);

    return refreshToken;
  }
);
