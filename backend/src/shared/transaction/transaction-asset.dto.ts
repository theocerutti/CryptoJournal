import { OmitType } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';
import { AssetDto } from 'shared/asset';

export class TransactionAssetDto extends OmitType(AssetDto, ['priceTrackerUrl', 'name'] as const) {
  @IsNumber()
  id: number;
}
