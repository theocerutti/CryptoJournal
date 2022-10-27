import { UpdateUserDto, UserDto } from 'shared/user';
import { User } from 'model/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import HttpError from '../../exceptions/http.error';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private readonly UserRepo: UserRepository) {}

  async getAll(): Promise<User[]> {
    try {
      return await this.UserRepo.find();
    } catch (error) {
      throw new HttpError("Can't find all user", error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getById(userID: number): Promise<User> {
    try {
      return await this.UserRepo.findOneOrFail({ where: { id: userID } });
    } catch (error) {
      throw new HttpError(`Could not find user with id ${userID}`, error, HttpStatus.NOT_FOUND);
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      return await this.UserRepo.findOneOrFail({
        where: { email: email },
      });
    } catch (error) {
      throw new HttpError('Could not find user with this email', error, HttpStatus.NOT_FOUND);
    }
  }

  async create(userDTO: UserDto): Promise<User> {
    const user: User = new User();

    user.email = userDTO.email;
    user.password = userDTO.password;

    try {
      return await this.UserRepo.save(user);
    } catch (error) {
      throw new HttpError('Could not create user', error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(userID: number, userDTO: UpdateUserDto): Promise<User> {
    const user: User = await this.getById(userID);
    const updated = Object.assign(user, userDTO);

    try {
      return await this.UserRepo.save(updated);
    } catch (error) {
      throw new HttpError('Could not update user', error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async save(user: User): Promise<User> {
    return await this.UserRepo.save(user);
  }

  async delete(userID: number): Promise<User> {
    const user: User = await this.getById(userID);

    try {
      return await this.UserRepo.remove(user);
    } catch (error) {
      throw new HttpError('Could not remove user', error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
