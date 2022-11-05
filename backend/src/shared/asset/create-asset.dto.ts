import { OmitType } from '@nestjs/swagger';
import { AssetDto } from './asset.dto';

export class CreateAssetDto extends OmitType(AssetDto, ['id'] as const) {}
