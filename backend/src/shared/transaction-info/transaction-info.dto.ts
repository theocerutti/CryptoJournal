import { IsNumber, IsObject, IsString, IsUrl } from 'class-validator';
import { AssetDto } from '../asset';
import { PortfolioDto } from '../portfolio';

export class TransactionInfoDto {
  @IsNumber()
  id: number;

  @IsObject()
  asset: AssetDto;

  @IsObject()
  portfolio: PortfolioDto;

  @IsNumber()
  amount: number;

  @IsNumber()
  price: number;
}
