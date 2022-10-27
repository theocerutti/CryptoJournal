import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../../model/user.entity';
import { CreateUserDTO } from 'shared/auth';
import { RefreshTokenService } from './refresh_token.service';
import HttpError from '../../exceptions/http.error';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => RefreshTokenService))
    private refreshTokenService: RefreshTokenService
  ) {}

  async login(email: string, password: string): Promise<{ token: string; user: User }> | undefined {
    let user: User = await this.userService.getByEmail(email);

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      throw new HttpError('Bad password', null, HttpStatus.UNAUTHORIZED);
    }

    const access_token = await this.refreshTokenService.generateAccessToken(user);
    user = await this.refreshTokenService.createOrUpdateRefreshToken(user);
    return { token: access_token, user };
  }

  async register(createUserDTO: CreateUserDTO): Promise<User> {
    let user: User = null;
    try {
      user = await this.userService.getByEmail(createUserDTO.email);
    } catch (error) {
      // ok
    }

    if (user) {
      throw new HttpError('User already exists with this email!', null, HttpStatus.BAD_REQUEST);
    }

    user = new User();
    user.email = createUserDTO.email;
    user.password = createUserDTO.password;
    return await this.userService.create(user);
  }
}
