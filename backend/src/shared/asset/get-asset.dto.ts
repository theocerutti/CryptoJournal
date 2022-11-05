import { OmitType } from '@nestjs/swagger';
import { AssetDto } from './asset.dto';

export class GetAssetDto extends OmitType(AssetDto, [] as const) {}
