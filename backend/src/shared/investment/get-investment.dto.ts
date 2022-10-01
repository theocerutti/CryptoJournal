import { PartialType } from '@nestjs/swagger';
import { InvestmentDto } from './investment.dto';
import { IsNumber } from 'class-validator';

export class GetInvestmentDto extends PartialType(InvestmentDto) {
  @IsNumber()
  price: number | null;

  @IsNumber()
  pnl: number | null;

  @IsNumber()
  pnlPercent: number | null;

  @IsNumber()
  total: number | null;
}
