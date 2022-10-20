import { IsBoolean, IsNumber, IsObject } from 'class-validator';

export type InvestmentInfoByName = {
  count: number;
  totalInvested: number;
  totalFees: number;
  totalBalance: number;
  pnl: number;
  pnlPercent: number;
  averageBuyPrice: number;
  minBuyPrice: number;
  maxBuyPrice: number;
  minSellPrice: number;
  maxSellPrice: number;
};

export type InvestmentInfoByNames = {
  [key: string]: InvestmentInfoByName;
};

export class InvestmentGlobalInfoDto {
  @IsNumber()
  totalFees: number;

  @IsNumber()
  totalInvested: number;

  @IsNumber()
  totalBalance: number;

  @IsNumber()
  pnl: number;

  @IsNumber()
  pnlPercent: number;

  @IsNumber()
  investmentNameCount: number;

  @IsNumber()
  investmentCount: number;

  @IsObject()
  infoByName: InvestmentInfoByNames;

  @IsBoolean()
  hasScrapedPrices: boolean;
}
