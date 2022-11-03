import { OmitType } from '@nestjs/swagger';
import { TransactionV2Dto } from './transaction.dto';
import { IsNumber } from 'class-validator';

export class CreateTransactionV2Dto extends OmitType(TransactionV2Dto, ['id'] as const) {
  @IsNumber()
  portfolioId: number;
}
