import { IsNumber, IsString, IsUrl } from 'class-validator';

export class TransactionInfoDto {
  @IsNumber()
  id: number;

  @IsString()
  currency: string;

  @IsString()
  @IsUrl()
  priceLink: string;

  @IsNumber()
  amount: number;
}
