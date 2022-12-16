import { IsNumber, IsObject, IsString, IsUrl } from 'class-validator';

export class GlobalInfoAssetDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsUrl()
  logo: string;

  @IsNumber()
  price: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  fees: number;

  @IsNumber()
  totalBalance: number;
}

export class GlobalInfoDto {
  @IsNumber()
  pnl: number;

  @IsNumber()
  pnlPercent: number;

  @IsNumber()
  totalBalance: number;

  @IsNumber()
  totalInvested: number;

  @IsNumber()
  totalFees: number;

  @IsNumber()
  assetsCount: number;

  @IsNumber()
  transactionsCount: number;

  @IsObject()
  globalInfoAssets: GlobalInfoAssetDto[];
}
