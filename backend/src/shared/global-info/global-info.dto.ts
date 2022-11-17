import { IsBoolean, IsNumber, IsObject, IsUrl } from 'class-validator';
import { GetAssetDto } from '../asset';

export class GlobalInfoAssetDto {
  @IsObject()
  asset: GetAssetDto;

  @IsUrl()
  assetLogoURL: string;

  @IsNumber()
  price: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  fees: number;

  @IsNumber()
  pnl: number;

  @IsNumber()
  pnlPercent: number;

  @IsNumber()
  totalBalance: number;
}

export class GlobalInfoDto {
  @IsBoolean()
  hasScrapedPrices: boolean;

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

  @IsObject()
  globalInfoAssets: GlobalInfoAssetDto[];
}
