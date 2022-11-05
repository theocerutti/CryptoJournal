import { OmitType } from '@nestjs/swagger';
import { AssetDto } from './asset.dto';

export class UpdateAssetDto extends OmitType(AssetDto, [] as const) {}
