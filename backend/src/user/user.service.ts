import { UserDTO, UserUpdateDTO } from './user.dto';
import { User } from '../model/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly UserRepo: UserRepository
  ) {}

  async getAll(): Promise<User[]> {
    try {
      return await this.UserRepo.find();
    } catch (error) {
      throw new HttpException(
        `Can't find all user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getById(userID: number): Promise<User> {
    try {
      return await this.UserRepo.findOneOrFail({ where: { id: userID } });
    } catch (error) {
      throw new HttpException(
        `Could not find user: ${error.message}`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  async getByIds(userIds: number[]): Promise<User[]> {
    try {
      return await this.UserRepo.findByIds(userIds);
    } catch (error) {
      throw new HttpException(
        `Can't get users: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      return await this.UserRepo.findOneOrFail({
        where: { email: email },
      });
    } catch (error) {
      throw new HttpException(
        `Could not find user by email ${error.message}`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  async create(userDTO: UserDTO): Promise<User> {
    const user: User = new User();

    user.email = userDTO.email;
    user.password = userDTO.password;

    try {
      return await this.UserRepo.save(user);
    } catch (error) {
      throw new HttpException(
        `Could not create user : ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(userID: number, userDTO: UserUpdateDTO): Promise<User> {
    const user: User = await this.getById(userID);
    const updated = Object.assign(user, userDTO);

    try {
      return await this.UserRepo.save(updated);
    } catch (error) {
      throw new HttpException(
        `Could not update user : ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
      throw new HttpException(
        `Could not remove user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
