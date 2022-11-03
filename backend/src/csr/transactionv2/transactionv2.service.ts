import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionV2Repository } from './transactionv2.repository';
import { User } from '../../model/user.entity';
import { UserService } from '../user/user.service';
import { TransactionV2 } from '../../model/transactionv2.entity';
import { PortfolioService } from '../portfolio/portfolio.service';
import { CreateTransactionV2Dto, UpdateTransactionV2Dto } from '../../shared/transactionv2';

@Injectable()
export class TransactionV2Service {
  constructor(
    @InjectRepository(TransactionV2Repository)
    private readonly TransactionRepo: TransactionV2Repository,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => PortfolioService)) private portfolioService: PortfolioService
  ) {}

  async getAll(userId: number): Promise<TransactionV2[]> {
    return this.TransactionRepo.find({
      where: { user: { id: userId } },
    });
  }

  async getAllTransactionInfo(transactionId: number) {} // TODO
  async getTransactionInfo(transactionId: number) {} // TODO

  async get(userId: number, transactionId: number): Promise<TransactionV2> {
    return await this.TransactionRepo.findOne({
      relations: ['user'], // get from portfolio
      where: { user: { id: userId }, id: transactionId },
    });
  }

  async create(user: User, transactionDto: CreateTransactionV2Dto): Promise<TransactionV2> {
    const transaction = new TransactionV2();
    Object.assign(transaction, transactionDto);
    transaction.portfolio = await this.portfolioService.get(user.id, transactionDto.portfolioId);
    return await this.TransactionRepo.save(transaction);
  }

  async update(userId: number, transactionDto: UpdateTransactionV2Dto): Promise<TransactionV2> {
    const transaction = await this.get(userId, transactionDto.id);
    const updated = Object.assign(transaction, transactionDto);
    return await this.TransactionRepo.save(updated);
  }

  async delete(userId: number, transactionId: number): Promise<TransactionV2> {
    const transaction = await this.get(userId, transactionId);
    return await this.TransactionRepo.remove(transaction);
  }
}
