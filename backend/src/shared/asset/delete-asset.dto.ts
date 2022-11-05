import { OmitType } from '@nestjs/swagger';
import { AssetDto } from './asset.dto';

export class DeleteAssetDto extends OmitType(AssetDto, [] as const) {}
