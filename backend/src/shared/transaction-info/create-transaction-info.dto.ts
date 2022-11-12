import { OmitType } from '@nestjs/swagger';
import { TransactionInfoDto } from './transaction-info.dto';
import { IsObject } from 'class-validator';
import { GetAssetDto } from '../asset';
import { GetPortfolioDto } from '../portfolio';

export class CreateTransactionInfoDto extends OmitType(TransactionInfoDto, ['id', 'asset', 'portfolio'] as const) {
  @IsObject()
  asset: GetAssetDto;

  @IsObject()
  portfolio: GetPortfolioDto;
}
