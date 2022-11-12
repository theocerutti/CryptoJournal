import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'csr/auth/current-user.decorator';
import { User } from 'model/user.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, GetTransactionDto, UpdateTransactionDto } from '../../shared/transaction';
import { Transaction } from '../../model/transaction.entity';

@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private transactionService: TransactionService) {}

  @Get()
  public async getAll(@CurrentUser() user: User): Promise<GetTransactionDto[]> {
    this.logger.log(`GetAll with userId=${user.id}`);
    return await this.transactionService.getAll(user.id);
  }

  @Get(':transactionId')
  public async get(
    @CurrentUser() user: User,
    @Param('transactionId', ParseIntPipe) transaction: number
  ): Promise<GetTransactionDto> {
    this.logger.log(`Get transaction=${transaction}`);
    return await this.transactionService.get(user.id, transaction);
  }

  @Get('infos')
  public async getAllTransactionInfo(@CurrentUser() user: User) {
    this.logger.log(`GetAllTransactionInfo with userId=${user.id}`);
    return await this.transactionService.getAllTransactionInfo(user.id);
  }

  @Post()
  public async create(@CurrentUser() user: User, @Body() transactionDTO: CreateTransactionDto): Promise<Transaction> {
    this.logger.log(`Create ${transactionDTO}`);
    return await this.transactionService.create(user, transactionDTO);
  }

  @Put()
  public async update(@CurrentUser() user: User, @Body() transactionDTO: UpdateTransactionDto): Promise<Transaction> {
    this.logger.log(`Update ${transactionDTO}`);
    return await this.transactionService.update(user.id, transactionDTO);
  }

  @Delete(':transactionId')
  public async delete(
    @CurrentUser() user: User,
    @Param('transactionId', ParseIntPipe) transaction: number
  ): Promise<Transaction> {
    this.logger.log(`Delete transaction=${transaction}`);
    return await this.transactionService.delete(user.id, transaction);
  }
}
