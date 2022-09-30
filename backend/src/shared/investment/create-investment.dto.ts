import { OmitType } from '@nestjs/swagger';
import { InvestmentDto } from './investment.dto';

export class CreateInvestmentDto extends OmitType(InvestmentDto, [
  'id',
] as const) {}
