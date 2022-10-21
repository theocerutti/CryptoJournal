import { RefreshToken } from 'model/refresh_token.entity';
import { User } from 'model/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(RefreshToken)
export class RefreshTokensRepository extends Repository<RefreshToken> {
  public async createRefreshToken(user: User, ttl: number): Promise<RefreshToken> {
    const token = new RefreshToken();
    token.user = user;
    token.is_revoked = false;
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);
    token.expires = expiration;
    return this.save(token);
  }
}
