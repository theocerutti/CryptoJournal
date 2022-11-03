import { PartialType } from '@nestjs/swagger';
import { PortfolioDto } from './portfolio.dto';

export class GetPortfolioDto extends PartialType(PortfolioDto) {}
