import { EntityRepository, Repository } from 'typeorm';
import { Investment } from '../model/investment.entity';

@EntityRepository(Investment)
export class InvestmentRepository extends Repository<Investment> {}
