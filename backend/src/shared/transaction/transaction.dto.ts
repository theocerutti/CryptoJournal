import { IsDateString, IsNumber, IsObject, IsString } from 'class-validator';
import { TransactionInfoDto } from '../transaction-info';
import { AssetDto } from '../asset';

export class TransactionDto {
  @IsNumber()
  id: number;

  @IsObject()
  from: TransactionInfoDto;

  @IsObject()
  to: TransactionInfoDto;

  @IsString()
  note: string;

  @IsNumber()
  feesPrice: number;

  @IsNumber()
  feesAmount: number;

  @IsObject()
  feesCurrency: AssetDto;

  @IsDateString()
  date: Date;
}
