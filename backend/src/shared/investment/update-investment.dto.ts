import { PartialType } from '@nestjs/swagger';
import { InvestmentDto } from './investment.dto';

export class UpdateInvestmentDto extends PartialType(InvestmentDto) {}
