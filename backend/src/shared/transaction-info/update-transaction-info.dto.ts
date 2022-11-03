import { OmitType } from '@nestjs/swagger';
import { TransactionInfoDto } from './transaction-info.dto';

export class UpdateTransactionInfoDto extends OmitType(TransactionInfoDto, [] as const) {}
