import { IsDate, IsNumber, IsString } from 'class-validator';

export class InvestmentDto {
  @IsNumber()
  id: number;

  @IsDate()
  buyDate: Date;

  @IsDate()
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
