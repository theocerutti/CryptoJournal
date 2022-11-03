import { IsDateString, IsNumber, IsObject, IsString } from 'class-validator';
import { TransactionInfoDto } from '../transaction-info';

export class TransactionV2Dto {
  @IsNumber()
  id: number;

  @IsObject()
  from: TransactionInfoDto;

  @IsObject()
  to: TransactionInfoDto;

  @IsString()
  note: string;

  @IsNumber()
  fees: number;

  @IsString()
  feesCurrency: string;

  @IsDateString()
  date: Date;
}
