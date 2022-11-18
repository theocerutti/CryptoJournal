import { OmitType } from '@nestjs/swagger';
import { TransactionInfoDto } from './transaction-info.dto';
import { IsObject } from 'class-validator';
import { GetPortfolioDto } from '../portfolio';

export class CreateTransactionInfoDto extends OmitType(TransactionInfoDto, ['id', 'portfolio'] as const) {
  @IsObject()
  portfolio: GetPortfolioDto;
}
