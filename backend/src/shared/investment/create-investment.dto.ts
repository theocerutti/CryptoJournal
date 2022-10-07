import { InvestmentDto } from './investment.dto';
import { OmitType } from '@nestjs/swagger';

export class CreateInvestmentDto extends OmitType(InvestmentDto, [
  'id',
  'status',
] as const) {}
