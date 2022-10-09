import { InvestmentDto } from './investment.dto';
import { OmitType } from '@nestjs/swagger';

export class CreateInvestmentDto extends OmitType(InvestmentDto, [
  'id',
  'orderStatus',
] as const) {}
