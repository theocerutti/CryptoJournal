import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayloadAccessToken } from './auth.utils';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfig } from '../../app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService<EnvironmentConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  // here is to transform the payload
  // we don't have to transform it so we can return it
  async validate(payload: any): Promise<JwtPayloadAccessToken> {
    return {
      email: payload.email,
      userId: payload.userId,
    };
  }
}
