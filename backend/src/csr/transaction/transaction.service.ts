import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { User } from '../../model/user.entity';
import { UserService } from '../user/user.service';
import { Transaction } from '../../model/transaction.entity';
import { PortfolioService } from '../portfolio/portfolio.service';
import { CreateTransactionDto, UpdateTransactionDto } from '../../shared/transaction';
import { TransactionInfoRepository } from './transaction-info.repository';
import { Portfolio } from '../../model/portfolio.entity';
import { Asset } from '../../model/asset.entity';
import { AssetService } from '../asset/asset.service';
import { ScrapeDataContainer } from '../../schedulers/ScrapeDataContainer';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly TransactionRepo: TransactionRepository,
    @InjectRepository(TransactionInfoRepository)
    private readonly TransactionInfoRepo: TransactionRepository,
    @Inject(forwardRef(() => AssetService)) private assetService: AssetService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => PortfolioService)) private portfolioService: PortfolioService
  ) {}

  // TODO: Every get functions must be rethinked
  async getPNL(userId: number): Promise<number> {
    const totalBalance = await this.getTotalBalance(userId);
    const totalInvested = await this.getTotalInvested(userId);
    return totalBalance - totalInvested;
  }

  async getPNLPercent(userId: number): Promise<number> {
    const pnl = await this.getPNL(userId);
    const totalInvested = await this.getTotalInvested(userId);

    if (totalInvested === 0) {
      return 0;
    }
    return (pnl / totalInvested) * 100;
  }

  async getTotalBalance(userId: number): Promise<number> {
    const assets = await this.assetService.getAll(userId);
    let totalBalance = 0;

    for (const asset of assets) totalBalance += await this.getTotalBalanceAsset(userId, asset);
    return totalBalance;
  }

  async getTotalFees(userId: number): Promise<number> {
    const assets = await this.assetService.getAll(userId);
    let totalFees = 0;

    for (const asset of assets) totalFees += await this.getTotalFeesAsset(userId, asset);
    return totalFees;
  }

  async getTotalInvested(userId: number): Promise<number> {
    const bankPortfolios: Portfolio[] = await this.portfolioService.getBankPortfolios(userId);
    let totalInvested = 0;
    for (const portfolio of bankPortfolios) {
      if (portfolio.isMyBank) {
        const transactions = await this.TransactionRepo.getTransactionsFromPortfolio(portfolio.id);
        for (const transaction of transactions) {
          totalInvested += transaction.from.amount * transaction.from.price;
        }
      }
    }
    return totalInvested;
  }

  async getTotalAmountAsset(userId: number, asset: Asset): Promise<number> {
    const transactions = await this.TransactionRepo.getUserTransactionByAsset(userId, asset);
    let totalAmount = 0;

    for (const transaction of transactions) {
      if (transaction.from.asset.id === asset.id) {
        totalAmount -= transaction.from.amount;
      } else if (transaction.to.asset.id === asset.id) {
        totalAmount += transaction.to.amount;
      }
    }
    return totalAmount;
  }

  async getTotalFeesAsset(userId: number, asset: Asset): Promise<number> {
    const transactions = await this.TransactionRepo.getUserTransactionByAsset(userId, asset);
    let fees = 0;

    for (const transaction of transactions) {
      fees += transaction.feeAmount * transaction.feePrice;
    }
    return fees;
  }

  async getPNLAsset(userId: number, asset: Asset): Promise<number> {
    const totalBalance = await this.getTotalBalanceAsset(userId, asset);
    const totalInvested = await this.getTotalInvestedAsset(userId, asset);
    return totalBalance - totalInvested;
  }

  async getPNLPercentAsset(userId: number, asset: Asset): Promise<number> {
    const pnl = await this.getPNLAsset(userId, asset);
    const totalInvested = await this.getTotalInvestedAsset(userId, asset);

    if (totalInvested === 0) {
      return 0;
    }
    return (pnl / totalInvested) * 100;
  }

  async getTotalInvestedAsset(userId: number, asset: Asset): Promise<number> {
    return 1;
  }

  async getTotalBalanceAsset(userId: number, asset: Asset): Promise<number> {
    const totalAmount = await this.getTotalAmountAsset(userId, asset);
    return totalAmount * ScrapeDataContainer.getInstance().getPrice(asset.name);
  }

  async getAll(userId: number): Promise<Transaction[]> {
    return await this.TransactionRepo.getUserTransactions(userId);
  }

  async get(userId: number, transactionId: number): Promise<Transaction> {
    return await this.TransactionRepo.getUserTransaction(userId, transactionId);
  }

  async create(user: User, transactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = new Transaction();
    Object.assign(transaction, transactionDto);
    transaction.user = user;
    return await this.TransactionRepo.save(transaction);
  }

  async update(userId: number, transactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.get(userId, transactionDto.id);
    const updated = Object.assign(transaction, transactionDto);
    return await this.TransactionRepo.save(updated);
  }

  async delete(userId: number, transactionId: number): Promise<Transaction> {
    const transaction = await this.get(userId, transactionId);
    return await this.TransactionRepo.remove(transaction);
  }

  async getAllTransactionInfo(userId: number) {
    return this.TransactionInfoRepo.createQueryBuilder('transaction_info')
      .addFrom(Transaction, 'transaction')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction_info.id = transaction.from')
      .orWhere('transaction_info.id = transaction.to')
      .getMany();
  }
}
