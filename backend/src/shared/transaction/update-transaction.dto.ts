import { PartialType } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';

export class UpdateTransactionDto extends PartialType(TransactionDto) {}
