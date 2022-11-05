import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../utils/BaseEntityRepository';
import { Transaction } from '../../model/transaction.entity';

@EntityRepository(Transaction)
export class TransactionRepository extends BaseEntityRepository<Transaction> {}
