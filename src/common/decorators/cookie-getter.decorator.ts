import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';

export const CookieOrHeaderGetter = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<string> => {
    const request = context.switchToHttp().getRequest();
    let refreshToken = request.cookies[data];

    if (!refreshToken) {
      const refreshHeader = request.headers[data];

      if (!refreshHeader) throw new UnauthorizedException('Token is not found');

      const bearer = refreshHeader.split(' ')[0];
      refreshToken = refreshHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !refreshToken)
        throw new UnauthorizedException('Token is not found');
    }

    return refreshToken;
  }
);
