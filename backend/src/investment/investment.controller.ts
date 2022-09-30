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
import { InvestmentDto } from 'shared/investment';

@Controller('investments')
export class InvestmentController {
  private readonly logger = new Logger(InvestmentController.name);

  constructor(private investmentService: InvestmentService) {}

  @Get()
  public async getAll(@CurrentUser() user: User): Promise<Investment[]> {
    this.logger.log(`GetAll with userId=${user.id}`);
    return this.investmentService.getAll(user.id);
  }

  @Get(':investmentId')
  public async get(
    @CurrentUser() user: User,
    @Param('investmentId', ParseIntPipe) investmentId: number
  ): Promise<Investment> {
    this.logger.log(`Get investmentId=${investmentId}`);
    return this.investmentService.get(user.id, investmentId);
  }

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Body() investmentDTO: InvestmentDto
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
}
