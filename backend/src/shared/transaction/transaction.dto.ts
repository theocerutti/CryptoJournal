import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

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

  // TODO: these fields (toBank, fromBank) are used to know if amount should be counted/remove in the total invested amount
  // indeed if the transaction is "toBank" then it means that the amount is removed from the total invested amount
  // and if the transaction is "fromBank" then it means that the amount is added to the total invested amount
  // These are temporary fields. The solution is to have an dropdown of "from" and "to" with the list of your bank (that will be tagged as "bank") and the list of your others places (Binance, Ledger..)
  @IsBoolean()
  toBank: boolean;

  @IsBoolean()
  fromBank: boolean;

  @IsNumber()
  fees: number;
}
