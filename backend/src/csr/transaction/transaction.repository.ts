import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../utils/BaseEntityRepository';
import { Transaction } from '../../model/transaction.entity';

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

  async getUserTransactionByAsset(userId: number, assetId: number): Promise<Transaction[]> {
    return this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.from', 'from')
      .leftJoinAndSelect('transaction.to', 'to')
      .leftJoinAndSelect('from.portfolio', 'fromPortfolio')
      .leftJoinAndSelect('to.portfolio', 'toPortfolio')
      .where('transaction.user = :userId', { userId })
      .andWhere('from.assetId = :assetId OR to.assetId = :assetId', { assetId: assetId })
      .getMany();
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.from', 'from')
      .leftJoinAndSelect('transaction.to', 'to')
      .leftJoinAndSelect('from.portfolio', 'fromPortfolio')
      .leftJoinAndSelect('to.portfolio', 'toPortfolio')
      .where('transaction.user = :userId', { userId })
      .getMany();
  }

  async getAllAssetId(userId: number): Promise<number[]> {
    const fromAssetIds = await this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.from', 'from')
      .where('transaction.user = :userId', { userId })
      .select('DISTINCT ("from"."assetId")')
      .getRawMany();
    const toAssetIds = await this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.from', 'to')
      .where('transaction.user = :userId', { userId })
      .select('DISTINCT ("to"."assetId")')
      .getRawMany();
    const feesAssetIds = await this.createQueryBuilder('transaction')
      .where('transaction.user = :userId', { userId })
      .select('DISTINCT ("feeAssetId")')
      .getRawMany();
    return [
      ...new Set([
        ...toAssetIds.map((item) => item.assetId),
        ...fromAssetIds.map((item) => item.assetId),
        ...feesAssetIds.map((item) => item.feeAssetId),
      ]),
    ];
  }
}
