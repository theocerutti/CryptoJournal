import { IsBoolean, IsNumber, IsObject } from 'class-validator';

export class GlobalInfoAssetDto {
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
  globalInfoAssets: { [assetName: string]: GlobalInfoAssetDto };
}
