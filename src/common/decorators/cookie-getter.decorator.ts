import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import ErrorsTypes from 'src/errors/errors.enum';

export const CookieOrHeaderGetter = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<string> => {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies[data];

    if (!refreshToken) {
      const refreshHeader = request.headers[data];

      if (!refreshHeader) throw new UnauthorizedException(ErrorsTypes.UNAUTHORIZED_TOKEN_NOT_FOUND);

      const [bearer, token] = refreshHeader.split(' ');

      if (bearer !== 'Bearer' || !token)
        throw new UnauthorizedException(ErrorsTypes.UNAUTHORIZED_TOKEN_NOT_FOUND);
      return token;
    }

    return refreshToken;
  }
);
