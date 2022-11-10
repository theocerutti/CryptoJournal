import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../utils/BaseEntityRepository';
import { Transaction } from '../../model/transaction.entity';
import { Portfolio } from '../../model/portfolio.entity';
import { Asset } from '../../model/asset.entity';

@EntityRepository(Transaction)
export class TransactionRepository extends BaseEntityRepository<Transaction> {
  async getUserTransaction(userId: number, transactionId: number): Promise<Transaction> {
    return this.findOne({
      where: { user: { id: userId }, id: transactionId },
    });
  }

  async getTransactionsFromPortfolio(portfolioId: number): Promise<Transaction[]> {
    return await this.find({
      relations: ['from'],
      where: { from: { portfolio: { id: portfolioId } } },
    });
  }

  async getUserTransactionByAsset(userId: number, asset: Asset): Promise<Transaction[]> {
    return this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.from', 'from')
      .leftJoinAndSelect('transaction.to', 'to')
      .leftJoinAndSelect('from.asset', 'fromAsset')
      .leftJoinAndSelect('to.asset', 'toAsset')
      .where('transaction.user = :userId', { userId })
      .andWhere('from.assetId = :assetId OR to.assetId = :assetId', { assetId: asset.id })
      .getMany();
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.find({
      where: { user: { id: userId } },
    });
  }
}
