import { EntityRepository, Repository } from 'typeorm';
import { Investment } from 'model/investment.entity';
import { User } from '../model/user.entity';

@EntityRepository(Investment)
export class InvestmentRepository extends Repository<Investment> {
  private async getColumnSum(column: string, user: User): Promise<number> {
    const { sum } = await this.createQueryBuilder('investment')
      .leftJoin('investment.user', 'user')
      .where('user.id = :id', { id: user.id })
      .select(`SUM(investment.${column})`, 'sum')
      .getRawOne();
    return parseFloat(sum);
  }

  public async getDistinct(column: string): Promise<string[]> {
    const res = await this.createQueryBuilder('investment')
      .select(`DISTINCT(investment.${column})`, 'distinct')
      .getRawMany();
    return res.map((item) => item.distinct);
  }

  public async getTotalInvested(user: User): Promise<number> {
    return this.getColumnSum('investedAmount', user);
  }

  public async getTotalFees(user: User): Promise<number> {
    return this.getColumnSum('fees', user);
  }
}
