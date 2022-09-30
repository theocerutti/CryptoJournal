import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
