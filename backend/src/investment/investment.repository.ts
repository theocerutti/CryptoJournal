import { EntityRepository } from 'typeorm';
import { Investment } from 'model/investment.entity';
import { User } from '../model/user.entity';
import { BaseEntityRepository } from '../utils/BaseEntityRepository';

@EntityRepository(Investment)
export class InvestmentRepository extends BaseEntityRepository<Investment> {
  public async getTotalInvested(user: User): Promise<number> {
    return this.getColumnSumByUser('investedAmount', user);
  }

  public async getTotalFees(user: User): Promise<number> {
    return this.getColumnSumByUser('fees', user);
  }
}
