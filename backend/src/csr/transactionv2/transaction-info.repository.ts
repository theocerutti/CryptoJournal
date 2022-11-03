import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../utils/BaseEntityRepository';
import { TransactionInfo } from '../../model/transaction-info.entity';

@EntityRepository(TransactionInfo)
export class TransactionInfoRepository extends BaseEntityRepository<TransactionInfo> {}
