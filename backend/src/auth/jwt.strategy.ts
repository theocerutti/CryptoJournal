import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants, JwtPayloadAccessToken } from './auth.utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // here is to transform the payload
  // we don't have to transform it so we can return it
  async validate(payload: any): Promise<JwtPayloadAccessToken> {
    return {
      username: payload.username,
      userId: payload.userId,
    };
  }
}
