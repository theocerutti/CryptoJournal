import { User } from '../model/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { getRepository, Not, Repository } from 'typeorm';
import * as faker from 'faker';
import { Portfolio } from '../model/portfolio.entity';
import { Transaction } from '../model/transaction.entity';
import { TransactionInfo } from '../model/transaction-info.entity';

const SEED_USER = 10;
const SEED_TRANSACTIONS_BY_USER = 100;

const portfolioNames = ['My Bank', 'Binance', 'Ledger', 'Bybit', 'RealT'];

const assetInfos = [
  {
    id: 1,
    symbol: 'BTC',
    averagePrice: 16000,
  },
  {
    id: 2,
    symbol: 'LTC',
    averagePrice: 60,
  },
  {
    id: 1027,
    symbol: 'ETH',
    averagePrice: 1200,
  },
  {
    id: 3513,
    symbol: 'FTM',
    averagePrice: 0.18,
  },
  {
    id: 4642,
    symbol: 'HBAR',
    averagePrice: 0.05,
  },
  {
    id: 3794,
    symbol: 'ATOM',
    averagePrice: 10,
  },
];

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  userRepo: Repository<User>;
  transactionRepo: Repository<Transaction>;
  transactionInfoRepo: Repository<TransactionInfo>;
  portfolioRepo: Repository<Portfolio>;

  buildSeeder() {
    this.logger.log('Getting repositories...');
    this.userRepo = getRepository(User);
    this.transactionRepo = getRepository(Transaction);
    this.transactionInfoRepo = getRepository(TransactionInfo);
    this.portfolioRepo = getRepository(Portfolio);
  }

  async cleanDatabase() {
    this.logger.log('Clean database...');
    await this.userRepo.delete({});
    await this.transactionRepo.delete({});
    await this.transactionInfoRepo.delete({});
    await this.portfolioRepo.delete({});
  }

  async seedUsers(): Promise<User[]> {
    this.logger.log('Seed users...');
    const users = [];

    for (let i = 0; i < SEED_USER; i++) {
      const user = new User();
      user.email = faker.internet.email();
      user.password = 'password';
      user.erc20Address = faker.finance.ethereumAddress();
      user.btcAddress = faker.finance.bitcoinAddress();
      users.push(user);
    }
    const user = new User();
    user.email = 'user@gmail.com';
    user.password = 'password';
    user.erc20Address = faker.finance.ethereumAddress();
    user.btcAddress = faker.finance.bitcoinAddress();
    users.push(user);

    const emptyUser = new User();
    emptyUser.email = 'emptyuser@gmail.com';
    emptyUser.password = 'password';
    emptyUser.erc20Address = faker.finance.ethereumAddress();
    emptyUser.btcAddress = faker.finance.bitcoinAddress();
    await this.userRepo.save(emptyUser);
    return await this.userRepo.save(users);
  }

  async seedPortfolio(users: User[]) {
    this.logger.log('Seed portfolio...');

    for (const user of users) {
      for (const portfolioName of portfolioNames) {
        const portfolio = new Portfolio();
        portfolio.isMyBank = false;
        portfolio.user = user;
        portfolio.name = portfolioName;
        portfolio.description = faker.lorem.lines(1);
        if (portfolioName === 'My Bank') {
          portfolio.isMyBank = true;
        }
        await this.portfolioRepo.save(portfolio);
      }
    }
  }

  async getRandomPortfolio(user: User, expectPortfolioId: number = -1, includeIsMyBank: boolean = false) {
    const portfolios = await this.portfolioRepo.find({
      where: { user: { id: user.id }, id: Not(expectPortfolioId), ...(includeIsMyBank ? {} : { isMyBank: false }) },
    });
    return faker.random.arrayElement(portfolios);
  }

  getRandomAsset(user: User, expectAssetId: number = -1) {
    return faker.random.arrayElement(assetInfos.filter((asset) => asset.id !== expectAssetId));
  }

  createTransaction(
    fromAsset: any,
    toAsset: any,
    feeAsset: any,
    fromPortfolio: Portfolio,
    toPortfolio: Portfolio,
    user: User
  ) {
    const transactionInfoFrom = new TransactionInfo();
    transactionInfoFrom.price = faker.datatype.float({ min: 0.1, max: 2 }) * fromAsset.averagePrice;
    transactionInfoFrom.portfolio = fromPortfolio;
    transactionInfoFrom.assetId = fromAsset.id;
    transactionInfoFrom.amount = faker.datatype.float({ min: 0.1, max: 2 });

    const transactionInfoTo = new TransactionInfo();
    transactionInfoTo.price = faker.datatype.float({ min: 0.1, max: 2 }) * toAsset.averagePrice;
    transactionInfoTo.portfolio = toPortfolio;
    transactionInfoTo.assetId = toAsset.id;
    transactionInfoTo.amount = faker.datatype.float({
      min: 0,
      max: 30,
    });

    const transaction = new Transaction();
    transaction.to = transactionInfoTo;
    transaction.from = transactionInfoFrom;
    transaction.note = faker.lorem.lines(3);
    transaction.user = user;
    transaction.date = faker.date.past();
    transaction.feePrice = feeAsset.averagePrice;
    transaction.feeAmount = faker.datatype.float({
      min: 0,
      max: 30,
    });
    transaction.feeAssetId = feeAsset.id;
    return transaction;
  }

  async seedTransactions(users: User[]) {
    this.logger.log('Seed transactions...');
    for (const user of users) {
      for (let i = 0; i < SEED_TRANSACTIONS_BY_USER; i++) {
        const fromPortfolio = await this.getRandomPortfolio(user);
        const toPortfolio = await this.getRandomPortfolio(user, fromPortfolio.id);
        const fromAsset = this.getRandomAsset(user);
        const toAsset = this.getRandomAsset(user, fromAsset.id);
        const feeAsset = this.getRandomAsset(user);
        await this.transactionRepo.save(
          this.createTransaction(fromAsset, toAsset, feeAsset, fromPortfolio, toPortfolio, user)
        );
      }
    }
  }

  async seed() {
    // call constructor-like
    this.buildSeeder();

    // clean db
    await this.cleanDatabase();

    // seeds
    const seededUsers = await this.seedUsers();
    await this.seedPortfolio(seededUsers);
    await this.seedTransactions(seededUsers);
  }
}
