import { OmitType } from '@nestjs/swagger';
import { InvestmentDto } from './investment.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class GetInvestmentDto extends OmitType(InvestmentDto, ['id'] as const) {
  @IsNumber()
  @IsOptional()
  price: number | null;
}
