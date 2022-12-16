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
import { CoinMarketCapService } from '../coinmarketcap/coinmarketcap.service';
import { CMCQuoteLatestData } from '../../shared/coinmarketcap';
import { TransactionFilterParsed } from '../../utils/TransactionFilterTransformer';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly TransactionRepo: TransactionRepository,
    @InjectRepository(TransactionInfoRepository)
    private readonly TransactionInfoRepo: TransactionRepository,
    @Inject(forwardRef(() => CoinMarketCapService)) private coinMarketCapService: CoinMarketCapService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => PortfolioService)) private portfolioService: PortfolioService
  ) {}

  async getAllAssetId(userId: number): Promise<number[]> {
    return await this.TransactionRepo.getAllAssetId(userId);
  }

  async getPNL(userId: number, assetQuotes: CMCQuoteLatestData): Promise<number> {
    const totalBalance = await this.getTotalBalance(userId, assetQuotes);
    const totalInvested = await this.getTotalInvested(userId);
    return totalBalance - totalInvested;
  }

  async getPNLPercent(userId: number, assetQuotes: CMCQuoteLatestData): Promise<number> {
    const pnl = await this.getPNL(userId, assetQuotes);
    const totalInvested = await this.getTotalInvested(userId);

    if (totalInvested === 0) {
      return 0;
    }
    return (pnl / totalInvested) * 100;
  }

  async getTotalBalance(userId: number, assetQuotes: CMCQuoteLatestData): Promise<number> {
    const assetIds = await this.getAllAssetId(userId);
    let totalBalance = 0;

    for (const assetId of assetIds) totalBalance += await this.getTotalBalanceAsset(userId, assetId, assetQuotes);
    return totalBalance;
  }

  async getTotalFees(userId: number): Promise<number> {
    const assetIds = await this.getAllAssetId(userId);
    let totalFees = 0;

    for (const assetId of assetIds) totalFees += await this.getTotalFeesAsset(userId, assetId);
    return totalFees;
  }

  async getTotalInvested(userId: number): Promise<number> {
    const bankPortfolios: Portfolio[] = await this.portfolioService.getBankPortfolios(userId);
    let totalInvested = 0;
    for (const portfolio of bankPortfolios) {
      if (portfolio.isMyBank) {
        const transactions = await this.TransactionRepo.getTransactionsFromPortfolio(portfolio.id); // TODO: use getAll and pass portfolio filter?
        for (const transaction of transactions) {
          totalInvested += transaction.from.amount * transaction.from.price;
        }
      }
    }
    return totalInvested;
  }

  async getTotalAmountAsset(userId: number, assetId: number): Promise<number> {
    const transactions = await this.TransactionRepo.getUserTransactionByAsset(userId, assetId);
    let totalAmount = 0;

    for (const transaction of transactions) {
      if (transaction.from.assetId === assetId) {
        totalAmount -= transaction.from.amount;
      } else if (transaction.to.assetId === assetId) {
        totalAmount += transaction.to.amount;
      }
    }
    return totalAmount;
  }

  async getTotalFeesAsset(userId: number, assetId: number): Promise<number> {
    const transactions = await this.TransactionRepo.getUserTransactionByAsset(userId, assetId);
    let fees = 0;

    for (const transaction of transactions) {
      fees += transaction.feeAmount * transaction.feePrice;
    }
    return fees;
  }

  async getTotalBalanceAsset(userId: number, assetId: number, assetQuotes: CMCQuoteLatestData): Promise<number> {
    const totalAmount = await this.getTotalAmountAsset(userId, assetId);
    const totalFees = await this.getTotalFeesAsset(userId, assetId);
    return totalAmount * assetQuotes[assetId].quote['USD'].price - totalFees;
  }

  async getAll(
    userId: number,
    portfolioFilter: TransactionFilterParsed,
    assetFilter: TransactionFilterParsed
  ): Promise<Transaction[]> {
    const queryBuilder = await this.TransactionRepo.getUserTransactionsQuery(userId);

    if (portfolioFilter) {
      if (Array.isArray(portfolioFilter)) {
        queryBuilder.andWhere(
          '(to.portfolioId IN (:...portfolioFilter) OR from.portfolioId IN (:...portfolioFilter))',
          { portfolioFilter }
        );
      } else {
        queryBuilder.andWhere('(to.portfolioId = :portfolioFilter OR from.portfolioId = :portfolioFilter)', {
          portfolioFilter,
        });
      }
    }
    if (assetFilter) {
      if (Array.isArray(assetFilter)) {
        queryBuilder.andWhere('(to.assetId IN (:...assetFilter) OR from.assetId IN (:...assetFilter))', {
          assetFilter,
        });
      } else {
        queryBuilder.andWhere('(to.assetId = :assetFilter OR from.assetId = :assetFilter)', { assetFilter });
      }
    }
    return queryBuilder.getMany();
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

  async getTransactionsCount(userId: number): Promise<number> {
    return await this.TransactionRepo.count({ where: { user: { id: userId } } });
  }

  async getAssetCount(userId: number): Promise<number> {
    const assetIds = await this.getAllAssetId(userId);
    return assetIds.length;
  }
}
