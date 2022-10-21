import { OmitType, PartialType } from '@nestjs/swagger';
import { InvestmentDto } from './investment.dto';

export class UpdateInvestmentDto extends OmitType(InvestmentDto, ['orderStatus'] as const) {}
