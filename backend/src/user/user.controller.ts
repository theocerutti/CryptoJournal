import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { User } from 'model/user.entity';
import { GetUserDto, UpdateUserDto } from 'shared/user';
import { UserService } from './user.service';
import { CurrentUser } from 'auth/current-user.decorator';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  private static mapUserToGetDto(user: User): GetUserDto {
    const userDTO = new GetUserDto();
    delete user.password; // TODO: must work with automapper
    Object.assign(userDTO, user);
    return userDTO;
  }

  @Get('/me')
  public async getMe(@CurrentUser() user: User): Promise<GetUserDto> {
    this.logger.log('GetMe with userId=', user.id);
    return UserController.mapUserToGetDto(user);
  }

  @Get()
  public async getAll(): Promise<GetUserDto[]> {
    this.logger.log('GetAll');
    const users = await this.userService.getAll();
    return users.map((user) => UserController.mapUserToGetDto(user));
  }

  @Put('/me')
  public async updateMe(
    @CurrentUser() user: User,
    @Body() userDTO: UpdateUserDto
  ): Promise<GetUserDto> {
    this.logger.log('Update me with userId=', user.id, ', DTO=', userDTO);
    const updatedUser = await this.userService.update(user.id, userDTO);
    return UserController.mapUserToGetDto(updatedUser);
  }

  @Delete('/me')
  public async deleteMe(@CurrentUser() user: User): Promise<User> {
    this.logger.log('Delete user with userId=', user.id);
    return await this.userService.delete(user.id);
  }

  @Delete(':userId')
  public async deleteUser(
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<GetUserDto> {
    this.logger.log('Delete user with id=', userId);
    const deletedUser = await this.userService.delete(userId);
    return UserController.mapUserToGetDto(deletedUser);
  }
}
