import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../model/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './auth.dto';
import { RefreshTokenService } from './refresh_token.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => RefreshTokenService))
    private refreshTokenService: RefreshTokenService
  ) {}

  async login(
    username: string,
    password: string
  ): Promise<{ token: string; user: User }> | undefined {
    let user: User = await this.userService.getByUsername(username);

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      throw new HttpException('Bad password', HttpStatus.UNAUTHORIZED);
    }

    const access_token = await this.refreshTokenService.generateAccessToken(
      user
    );
    user = await this.refreshTokenService.createOrUpdateRefreshToken(user);
    return { token: access_token, user };
  }

  async register(createUserDTO: CreateUserDTO): Promise<User> {
    let user: User = null;
    try {
      user = await this.userService.getByUsername(createUserDTO.username);
    } catch (error) {
      // ok
    }

    if (user) {
      throw new HttpException(
        'User already exists with this username!',
        HttpStatus.BAD_REQUEST
      );
    }

    user = new User();
    user.username = createUserDTO.username;
    user.password = createUserDTO.password;
    user.email = createUserDTO.email;
    return await this.userService.create(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.getByUsername(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
}
