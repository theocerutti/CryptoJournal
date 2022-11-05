import { IsNumber, IsObject, IsString, IsUrl } from 'class-validator';
import { AssetDto } from '../asset';

export class TransactionInfoDto {
  @IsNumber()
  id: number;

  @IsObject()
  asset: AssetDto;

  @IsNumber()
  amount: number;

  @IsNumber()
  price: number;
}
