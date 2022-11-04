import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'csr/auth/current-user.decorator';
import { User } from 'model/user.entity';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto, UpdatePortfolioDto } from '../../shared/portfolio';
import { Portfolio } from '../../model/portfolio.entity';

@Controller('portfolios')
export class PortfolioController {
  private readonly logger = new Logger(PortfolioController.name);

  constructor(private portfolioService: PortfolioService) {}

  @Get()
  public async getAll(@CurrentUser() user: User): Promise<Portfolio[]> {
    this.logger.log(`GetAll with userId=${user.id}`);
    return await this.portfolioService.getAll(user.id);
  }

  @Get(':portfolioId')
  public async get(
    @CurrentUser() user: User,
    @Param('portfolioId', ParseIntPipe) portfolioId: number
  ): Promise<Portfolio> {
    this.logger.log(`Get portfolioId=${portfolioId}`);
    return await this.portfolioService.get(user.id, portfolioId);
  }

  @Post()
  public async create(@CurrentUser() user: User, @Body() portfolioDTO: CreatePortfolioDto): Promise<Portfolio> {
    this.logger.log(`Create ${portfolioDTO}`);
    return await this.portfolioService.create(user, portfolioDTO);
  }

  @Put()
  public async update(@CurrentUser() user: User, @Body() portfolioDTO: UpdatePortfolioDto): Promise<Portfolio> {
    this.logger.log(`Update ${portfolioDTO}`);
    return await this.portfolioService.update(user.id, portfolioDTO);
  }
}
