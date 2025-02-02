import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ErrorCode } from 'src/errors/error-codes.enum';
import { UnauthorizedError } from 'src/errors/http.error';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedError(ErrorCode.ONLY_ADMINS_ALLOWED);
    }

    return true;
  }
}
