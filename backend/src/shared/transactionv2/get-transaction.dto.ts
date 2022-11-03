import { PartialType } from '@nestjs/swagger';
import { TransactionV2Dto } from './transaction.dto';

export class GetTransactionV2Dto extends PartialType(TransactionV2Dto) {}
