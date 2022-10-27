import { User } from 'model/user.entity';
import { JwtPayloadAccessToken, JwtPayloadRefreshToken } from './auth.utils';
import { RefreshToken } from 'model/refresh_token.entity';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokensRepository } from './refresh_token.repository';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'csr/user/user.service';
import HttpError, { HttpErrorCode } from '../../exceptions/http.error';

export const EXPIRATION_REFRESH_TOKEN = 60 * 60 * 24 * 30 * 1000; // 30 days;

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokensRepository)
    private readonly RefreshTokensRepo: RefreshTokensRepository,
    @Inject(forwardRef(() => JwtService)) private jwtService: JwtService,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {}

  public async createOrUpdateRefreshToken(user: User): Promise<User> {
    const refreshToken = await this.getByUserId(user.id);
    if (refreshToken && refreshToken.isExpired()) {
      await this.RefreshTokensRepo.remove(refreshToken);
      user.refresh_token = await this.RefreshTokensRepo.createRefreshToken(user, EXPIRATION_REFRESH_TOKEN * 1000);
      return await this.userService.save(user);
    } else if (!refreshToken) {
      user.refresh_token = await this.RefreshTokensRepo.createRefreshToken(user, EXPIRATION_REFRESH_TOKEN * 1000);
      return await this.userService.save(user);
    }
    return user;
  }

  public async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayloadAccessToken = {
      email: user.email,
      userId: user.id,
    };
    return this.jwtService.signAsync(payload);
  }

  public async createAccessTokenFromRefreshToken(refresh: string): Promise<string> {
    const { user } = await this.resolveRefreshToken(refresh);
    return await this.generateAccessToken(user);
  }

  public async generateRefreshToken(user: User, expiresIn: number): Promise<string> {
    const refresh_token = await this.RefreshTokensRepo.findOneOrFail({
      relations: ['user'],
      where: { user: { id: user.id } },
    });
    const payload: JwtPayloadRefreshToken = {
      userId: user.id,
      refreshTokenId: refresh_token.id,
    };
    return this.jwtService.signAsync(payload, { expiresIn });
  }

  public async resolveRefreshToken(encoded: string): Promise<{ user: User; token: RefreshToken }> {
    const payload: JwtPayloadRefreshToken = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) throw new HttpError('Refresh token not found', null, HttpStatus.UNAUTHORIZED, HttpErrorCode.JWT_ERROR);
    if (token.is_revoked)
      throw new HttpError('Refresh token revoked', null, HttpStatus.UNAUTHORIZED, HttpErrorCode.JWT_ERROR);

    const user = await this.getUserFromRefreshTokenPayload(payload);
    if (!user) throw new HttpError('Refresh token malformed', null, HttpStatus.UNAUTHORIZED, HttpErrorCode.JWT_ERROR);
    return { user, token };
  }

  public async getByUserId(userId: number): Promise<RefreshToken | null> {
    return await this.RefreshTokensRepo.findOne({
      relations: ['user'],
      where: { user: { id: userId } },
    });
  }

  private async decodeRefreshToken(token: string): Promise<JwtPayloadRefreshToken> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new HttpError('Refresh token expired', e, HttpStatus.UNAUTHORIZED, HttpErrorCode.JWT_ERROR);
      } else {
        throw new HttpError('Refresh token malformed', e, HttpStatus.UNAUTHORIZED, HttpErrorCode.JWT_ERROR);
      }
    }
  }

  private async getUserFromRefreshTokenPayload(payload: JwtPayloadRefreshToken): Promise<User> {
    const userId = payload.userId;
    if (!userId) throw new HttpError('Refresh token malformed', null, HttpStatus.UNAUTHORIZED, HttpErrorCode.JWT_ERROR);
    return this.userService.getById(userId);
  }

  private async getStoredTokenFromRefreshTokenPayload(payload: JwtPayloadRefreshToken): Promise<RefreshToken | null> {
    const tokenId = payload.refreshTokenId;
    if (!tokenId)
      throw new HttpError('Refresh token malformed', null, HttpStatus.UNAUTHORIZED, HttpErrorCode.JWT_ERROR);
    return this.RefreshTokensRepo.findOne(tokenId);
  }
}
