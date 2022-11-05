import { OmitType } from '@nestjs/swagger';
import { TransactionInfoDto } from './transaction-info.dto';
import { IsObject } from 'class-validator';
import { CreateAssetDto } from '../asset/create-asset.dto';

export class CreateTransactionInfoDto extends OmitType(TransactionInfoDto, ['id', 'asset'] as const) {
  @IsObject()
  asset: CreateAssetDto;
}
