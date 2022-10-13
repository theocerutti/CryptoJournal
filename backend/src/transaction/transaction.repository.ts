import { EntityRepository } from 'typeorm';
import { Transaction } from '../model/transaction.entity';
import { User } from '../model/user.entity';
import { BaseEntityRepository } from '../utils/BaseEntityRepository';

@EntityRepository(Transaction)
export class TransactionRepository extends BaseEntityRepository<Transaction> {
  public async getTotalInvested(user: User): Promise<number> {
    return this.getColumnSumByUser('amount', user);
  }
}
