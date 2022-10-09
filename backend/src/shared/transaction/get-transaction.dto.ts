import { PartialType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';

export class GetTransactionDto extends PartialType(TransactionDto) {}
