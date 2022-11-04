import { IsNumber, IsString, IsUrl } from 'class-validator';

export class TransactionInfoDto {
  @IsNumber()
  id: number;

  @IsString()
  asset: string;

  @IsString()
  @IsUrl()
  priceLink: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  price: number;
}
