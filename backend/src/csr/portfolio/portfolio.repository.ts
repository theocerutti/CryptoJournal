import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../utils/BaseEntityRepository';
import { Portfolio } from '../../model/portfolio.entity';

@EntityRepository(Portfolio)
export class PortfolioRepository extends BaseEntityRepository<Portfolio> {
  async hasBankPortfolio(userId: number): Promise<boolean> {
    const portfolios = await this.getBankPortfolios(userId);
    return portfolios.length > 0;
  }

  async getBankPortfolios(userId: number): Promise<Portfolio[]> {
    return await this.find({
      where: { user: { id: userId }, isMyBank: true },
    });
  }
}
