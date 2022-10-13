import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  erc20Address: string;

  @IsString()
  @IsOptional()
  btcAddress: string;
}
