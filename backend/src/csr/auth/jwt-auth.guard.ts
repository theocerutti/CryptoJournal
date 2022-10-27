import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './skip-auth.decorators';
import HttpError, { HttpErrorCode } from '../../exceptions/http.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      if (info.name === 'TokenExpiredError')
        throw new HttpError('Token expired', err, HttpStatus.UNAUTHORIZED, HttpErrorCode.JWT_ERROR);
      throw new HttpError(`Unauthorized: ${info.message}`, err, HttpStatus.UNAUTHORIZED, HttpErrorCode.JWT_ERROR);
    }
    if (user) return user;
    throw new HttpError('Unauthorized', err, HttpStatus.UNAUTHORIZED, HttpErrorCode.NONE);
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
