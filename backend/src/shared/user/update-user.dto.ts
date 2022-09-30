import { IsEmail } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

export class UserUpdateDTO extends OmitType(UserDTO, ['password'] as const) {
  @IsEmail()
  email: string;
}
