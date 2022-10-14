import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from '../model/transaction.entity';
import { User } from '../model/user.entity';
import { UserService } from '../user/user.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from '../shared/transaction';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly TransactionRepo: TransactionRepository,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {}

  async getAll(userId: number): Promise<Transaction[]> {
    return this.TransactionRepo.find({
      where: { user: { id: userId } },
    });
  }

  async get(userId: number, transactionId: number): Promise<Transaction> {
    return await this.TransactionRepo.findOne({
      relations: ['user'],
      where: { user: { id: userId }, id: transactionId },
    });
  }

  async create(
    user: User,
    transactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    const transaction = new Transaction();
    Object.assign(transaction, transactionDto);
    transaction.user = user;
    return await this.TransactionRepo.save(transaction);
  }

  async update(
    userId: number,
    transactionDto: UpdateTransactionDto
  ): Promise<Transaction> {
    const transaction = await this.get(userId, transactionDto.id);
    const updated = Object.assign(transaction, transactionDto);
    return await this.TransactionRepo.save(updated);
  }

  async delete(userId: number, transactionId: number): Promise<Transaction> {
    const transaction = await this.get(userId, transactionId);
    return await this.TransactionRepo.remove(transaction);
  }
}