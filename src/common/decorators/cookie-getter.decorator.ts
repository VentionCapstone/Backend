import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import ErrorsTypes from 'src/errors/errors.enum';

export const CookieOrHeaderGetter = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<string> => {
    const request = context.switchToHttp().getRequest();
    let refreshToken = request.cookies[data];

    if (!refreshToken) {
      const refreshHeader = request.headers[data];

      if (!refreshHeader) throw new UnauthorizedException(ErrorsTypes.UNAUTHORIZED_TOKEN_NOT_FOUND);

      const bearer = refreshHeader.split(' ')[0];
      refreshToken = refreshHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !refreshToken)
        throw new UnauthorizedException(ErrorsTypes.UNAUTHORIZED_TOKEN_NOT_FOUND);
    }

    return refreshToken;
  }
);
