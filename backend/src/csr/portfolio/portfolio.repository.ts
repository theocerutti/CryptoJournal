import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../utils/BaseEntityRepository';
import { Portfolio } from '../../model/portfolio.entity';

@EntityRepository(Portfolio)
export class PortfolioRepository extends BaseEntityRepository<Portfolio> {
  async hasBankPortfolio(userId: number): Promise<boolean> {
    const portfolio = await this.findOne({
      where: { user: { id: userId }, isMyBank: true },
    });
    return portfolio !== undefined;
  }
}
