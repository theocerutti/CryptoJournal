import { IsNumber, IsObject } from 'class-validator';
import { PortfolioDto } from '../portfolio';

export class TransactionInfoDto {
  @IsNumber()
  id: number;

  @IsNumber()
  assetId: number;

  @IsObject()
  portfolio: PortfolioDto;

  @IsNumber()
  amount: number;

  @IsNumber()
  price: number;
}
