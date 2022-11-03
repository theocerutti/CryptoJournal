import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../utils/BaseEntityRepository';
import { TransactionV2 } from '../../model/transactionv2.entity';

@EntityRepository(TransactionV2)
export class TransactionV2Repository extends BaseEntityRepository<TransactionV2> {}
