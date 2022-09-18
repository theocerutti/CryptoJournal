import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../model/user.entity';
import { UserUpdateDTO } from './user.dto';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Get()
  public async getMe(@CurrentUser() user: User): Promise<User> {
    this.logger.log('GetMe with userId=', user.id);
    return user;
  }

  @Get('all')
  public async getAll(): Promise<User[]> {
    this.logger.log('GetAll');
    return this.userService.getAll();
  }

  @Put()
  public async updateMe(
    @CurrentUser() user: User,
    @Body() userDTO: UserUpdateDTO
  ): Promise<User> {
    this.logger.log('Update me with userId=', user.id, ', DTO=', userDTO);
    return await this.userService.update(user.id, userDTO);
  }

  @Delete()
  public async deleteMe(@CurrentUser() user: User): Promise<User> {
    this.logger.log('Delete user with userId=', user.id);
    return await this.userService.delete(user.id);
  }

  @Get(':userId')
  public async getUser(
    @CurrentUser() currentUser: User,
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<User> {
    this.logger.log('Get user by id=', userId);
    if (currentUser.id === userId) {
      return await this.userService.getById(userId);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete(':userId')
  public async deleteUser(
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<User> {
    this.logger.log('Delete user with id=', userId);
    return await this.userService.delete(userId);
  }
}
