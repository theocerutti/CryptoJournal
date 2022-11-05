import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class PortfolioDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isMyBank: boolean;
}
