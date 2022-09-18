import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserUpdateDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
