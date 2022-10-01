import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from 'auth/current-user.decorator';
import { User } from 'model/user.entity';
import { InvestmentService } from './investment.service';
import { Investment } from 'model/investment.entity';
import {
  CreateInvestmentDto,
  InvestmentDto,
  InvestmentGlobalInfoDto,
} from 'shared/investment';
import { ScrapeDataContainer } from '../schedulers/ScrapeDataContainer';
import { ScrapeData } from '../shared/investment/scrape';
import { GetInvestmentDto } from '../shared/investment';

@Controller('investments')
export class InvestmentController {
  private readonly logger = new Logger(InvestmentController.name);

  constructor(private investmentService: InvestmentService) {}

  private static mapInvestmentToGetDto(
    investment: Investment
  ): GetInvestmentDto {
    const dto = new GetInvestmentDto();
    Object.assign(dto, investment);

    dto.price = ScrapeDataContainer.getInstance().getPrice(
      investment.priceLink
    );
    dto.total = dto.price * dto.holdings;
    dto.pnl = dto.total - dto.investedAmount;
    dto.pnlPercent = (dto.pnl / dto.investedAmount) * 100;
    return dto;
  }

  @Get()
  public async getAll(@CurrentUser() user: User): Promise<GetInvestmentDto[]> {
    this.logger.log(`GetAll with userId=${user.id}`);
    const investments = await this.investmentService.getAll(user.id);
    return investments.map((investment) =>
      InvestmentController.mapInvestmentToGetDto(investment)
    );
  }

  @Get('/global-info')
  public async getGlobalInfo(
    @CurrentUser() user: User
  ): Promise<InvestmentGlobalInfoDto> {
    this.logger.log(`GetGlobalInfo with userId=${user.id}`);
    return this.investmentService.getGlobalInfo(user);
  }

  @Get(':investmentId')
  public async get(
    @CurrentUser() user: User,
    @Param('investmentId', ParseIntPipe) investmentId: number
  ): Promise<GetInvestmentDto> {
    this.logger.log(`Get investmentId=${investmentId}`);
    const investment = await this.investmentService.get(user.id, investmentId);
    return InvestmentController.mapInvestmentToGetDto(investment);
  }

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Body() investmentDTO: CreateInvestmentDto
  ): Promise<Investment> {
    this.logger.log(`Create ${investmentDTO}`);
    return await this.investmentService.create(user, investmentDTO);
  }

  @Put()
  public async update(
    @CurrentUser() user: User,
    @Body() investmentDTO: InvestmentDto
  ): Promise<Investment> {
    this.logger.log(`Update ${investmentDTO}`);
    return await this.investmentService.update(user.id, investmentDTO);
  }

  @Delete(':investmentId')
  public async delete(
    @CurrentUser() user: User,
    @Param('investmentId', ParseIntPipe) investmentId: number
  ): Promise<Investment> {
    this.logger.log(`Delete investmentId=${investmentId}`);
    return await this.investmentService.delete(user.id, investmentId);
  }

  @Get('prices')
  public async getPrices(): Promise<ScrapeData> {
    return ScrapeDataContainer.getInstance().getData();
  }
}
