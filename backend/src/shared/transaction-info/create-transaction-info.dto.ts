import { OmitType } from '@nestjs/swagger';
import { TransactionInfoDto } from './transaction-info.dto';

export class CreateTransactionInfoDto extends OmitType(TransactionInfoDto, ['id'] as const) {}
