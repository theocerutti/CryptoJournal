import { IsDateString, IsNumber, IsString } from 'class-validator';

export class TransactionDto {
  @IsNumber()
  id: number;

  @IsDateString()
  date: Date;

  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  fees: number;
}
