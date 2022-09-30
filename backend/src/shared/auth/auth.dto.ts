import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
