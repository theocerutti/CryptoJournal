import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'csr/auth/current-user.decorator';
import { User } from 'model/user.entity';
import { TransactionV2Service } from './transactionv2.service';
import { CreateTransactionV2Dto, GetTransactionV2Dto, UpdateTransactionV2Dto } from '../../shared/transactionv2';
import { TransactionV2 } from '../../model/transactionv2.entity';

@Controller('transactionsv2')
export class TransactionV2Controller {
  private readonly logger = new Logger(TransactionV2Controller.name);

  constructor(private transactionService: TransactionV2Service) {}

  @Get(':portfolioId')
  public async getAll(@CurrentUser() user: User): Promise<GetTransactionV2Dto[]> {
    this.logger.log(`GetAll with userId=${user.id}`);
    return await this.transactionService.getAll(user.id);
  }

  @Get(':transactionId')
  public async get(
    @CurrentUser() user: User,
    @Param('transactionId', ParseIntPipe) transaction: number
  ): Promise<GetTransactionV2Dto> {
    this.logger.log(`Get transaction=${transaction}`);
    return await this.transactionService.get(user.id, transaction);
  }

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Body() transactionDTO: CreateTransactionV2Dto
  ): Promise<TransactionV2> {
    this.logger.log(`Create ${transactionDTO}`);
    return await this.transactionService.create(user, transactionDTO);
  }

  @Put()
  public async update(
    @CurrentUser() user: User,
    @Body() transactionDTO: UpdateTransactionV2Dto
  ): Promise<TransactionV2> {
    this.logger.log(`Update ${transactionDTO}`);
    return await this.transactionService.update(user.id, transactionDTO);
  }

  @Delete(':transactionId')
  public async delete(
    @CurrentUser() user: User,
    @Param('transactionId', ParseIntPipe) transaction: number
  ): Promise<TransactionV2> {
    this.logger.log(`Delete transaction=${transaction}`);
    return await this.transactionService.delete(user.id, transaction);
  }
}
