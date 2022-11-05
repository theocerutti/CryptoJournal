import { OmitType } from '@nestjs/swagger';
import { TransactionInfoDto } from './transaction-info.dto';
import { IsObject } from 'class-validator';
import { CreateAssetDto } from '../asset/create-asset.dto';

export class UpdateTransactionInfoDto extends OmitType(TransactionInfoDto, ['asset'] as const) {
  @IsObject()
  asset: CreateAssetDto;
}
