import { OmitType } from '@nestjs/swagger';
import { PortfolioDto } from './portfolio.dto';

export class UpdatePortfolioDto extends OmitType(PortfolioDto, [] as const) {}
