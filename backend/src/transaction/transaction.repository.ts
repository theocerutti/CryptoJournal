import { EntityRepository, Repository } from 'typeorm';
import { Transaction } from '../model/transaction.entity';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {}
