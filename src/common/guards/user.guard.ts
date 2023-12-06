import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../../auth/entities/auth.entity';
import { GlobalException } from 'src/exceptions/global.exception';
import ErrorsTypes from 'src/errors/errors.enum';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('User Unauthorized');

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer != 'Bearer' || !token) throw new UnauthorizedException('User Unauthorized');

    try {
      const user: Partial<User> = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });

      const findUser = await this.prismaService.user.findUnique({
        where: { email: user.email },
      });
      if (!findUser) throw new UnauthorizedException('Invalid token provided');

      req.user = findUser;

      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TOKEN_VERIFY);
    }
  }
}
