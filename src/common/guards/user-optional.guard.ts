import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserGuard } from './user.guard';

@Injectable()
export class ExtendedUserGuard extends UserGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canActivateResult = await super.canActivate(context);

      if (canActivateResult) {
        return true;
      }
    } catch (error) {
      if (error instanceof TokenExpiredError || error instanceof UnauthorizedException) {
        return true;
      }

      throw error;
    }

    return false;
  }
}
