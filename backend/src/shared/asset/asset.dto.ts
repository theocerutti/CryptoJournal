import { IsNumber, IsString, IsUrl } from 'class-validator';

export class AssetDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsUrl()
  priceTrackerUrl: string;

  @IsString()
  name: string;
}
