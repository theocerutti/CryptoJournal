import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../utils/BaseEntityRepository';
import { Portfolio } from '../../model/portfolio.entity';

@EntityRepository(Portfolio)
export class PortfolioRepository extends BaseEntityRepository<Portfolio> {}
