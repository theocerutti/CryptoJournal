import {
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class InvestmentDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsDateString()
  buyDate: Date;

  @IsDateString()
  @IsOptional()
  sellDate: Date;

  @IsNumber()
  buyPrice: number;

  @IsNumber()
  sellPrice: number;

  @IsString()
  buyNote: string;

  @IsString()
  sellNote: string;

  @IsString()
  name: string;

  @IsNumber()
  fees: number;

  @IsNumber()
  investedAmount: number;

  @IsNumber()
  holdings: number;

  @IsString()
  locationName: string;

  @IsString()
  primaryTag: string;

  @IsString()
  secondaryTag: string;

  @IsString()
  priceLink: string;
}
