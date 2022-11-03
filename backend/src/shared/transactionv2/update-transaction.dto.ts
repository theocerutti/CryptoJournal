import { OmitType } from '@nestjs/swagger';
import { TransactionV2Dto } from './transaction.dto';

export class UpdateTransactionV2Dto extends OmitType(TransactionV2Dto, [] as const) {}
