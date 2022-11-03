import { PartialType } from '@nestjs/swagger';
import { TransactionInfoDto } from './transaction-info.dto';

export class GetTransactionInfoDto extends PartialType(TransactionInfoDto) {}
