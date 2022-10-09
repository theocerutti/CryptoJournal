import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { InvestmentType, OrderInvestmentStatus } from './investment';

export class InvestmentDto {
  @IsNumber()
  id: number;

  @IsDateString()
  buyDate: Date;

  @IsDateString()
  @IsOptional()
  sellDate: Date;

  @IsNumber()
  buyPrice: number;

  @IsNumber()
  @IsOptional()
  sellPrice: number;

  @IsString()
  @IsOptional()
  buyNote: string;

  @IsString()
  @IsOptional()
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
  @IsOptional()
  locationName: string;

  @IsString()
  @IsOptional()
  primaryTag: string;

  @IsString()
  @IsOptional()
  secondaryTag: string;

  @IsString()
  priceLink: string;

  @IsEnum(OrderInvestmentStatus)
  orderStatus: OrderInvestmentStatus;

  @IsEnum(InvestmentType)
  type: InvestmentType;
}
