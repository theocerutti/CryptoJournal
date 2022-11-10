import { OmitType } from '@nestjs/swagger';
import { TransactionInfoDto } from './transaction-info.dto';
import { IsObject } from 'class-validator';
import { GetAssetDto } from '../asset';

export class CreateTransactionInfoDto extends OmitType(TransactionInfoDto, ['id', 'asset'] as const) {
  @IsObject()
  asset: GetAssetDto;
}
