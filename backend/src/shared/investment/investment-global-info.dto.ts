import { IsNumber } from 'class-validator';

export class InvestmentGlobalInfoDto {
  @IsNumber()
  totalFees: number;

  @IsNumber()
  totalInvested: number;

  @IsNumber()
  totalBalance: number;

  @IsNumber()
  pnl: number;
}
