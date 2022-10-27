import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './skip-auth.decorators';
import { ExpiredJwtToken } from './auth.errors';
import HttpError from '../../exceptions/http.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      if (info.name === 'TokenExpiredError') throw new ExpiredJwtToken();
      throw new HttpError(`Unauthorized: ${info.message}`, null, HttpStatus.UNAUTHORIZED);
    }
    if (user) return user;
    throw new UnauthorizedException();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
