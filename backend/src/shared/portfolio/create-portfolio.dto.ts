import { OmitType } from '@nestjs/swagger';
import { PortfolioDto } from './portfolio.dto';

export class CreatePortfolioDto extends OmitType(PortfolioDto, ['id'] as const) {}
