import { EntityRepository } from 'typeorm';
import { Transaction } from '../../model/transaction.entity';
import { User } from '../../model/user.entity';
import { BaseEntityRepository } from '../../utils/BaseEntityRepository';

@EntityRepository(Transaction)
export class TransactionRepository extends BaseEntityRepository<Transaction> {
  public async getTotalInvested(user: User): Promise<number> {
    let totalInvested = 0;
    const transactions = await this.find({
      where: { user: { id: user.id } },
    });

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      if (transaction.toBank) {
        totalInvested -= transaction.amount;
      } else if (transaction.fromBank) {
        totalInvested += transaction.amount;
      }
    }
    return totalInvested;
  }
}
