import { IsDateString, IsNumber, IsObject, IsString } from 'class-validator';
import { TransactionInfoDto } from '../transaction-info';

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
  feePrice: number;

  @IsNumber()
  feeAmount: number;

  @IsNumber()
  feeAssetId: number;

  @IsDateString()
  date: Date;
}
