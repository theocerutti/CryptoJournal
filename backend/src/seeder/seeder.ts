import { User } from '../model/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { getRepository, Not, Repository } from 'typeorm';
import * as faker from 'faker';
import { Portfolio } from '../model/portfolio.entity';
import { Transaction } from '../model/transaction.entity';
import { TransactionInfo } from '../model/transaction-info.entity';
import { Asset } from '../model/asset.entity';

const SEED_USER = 0;
const SEED_TRANSACTIONS_BY_USER = 100;

const portfolioNames = ['My Bank', 'Binance', 'Ledger', 'Bybit', 'RealT'];

const assetDatas: {
  [key: string]: { averagePrice: number; priceTrackerUrl: string };
} = {
  USD: {
    averagePrice: 1,
    priceTrackerUrl: 'https://coinmarketcap.com/currencies/tether/',
  },
  EUR: {
    averagePrice: 1.03,
    priceTrackerUrl: 'https://coinmarketcap.com/currencies/euro-coin/',
  },
  BTC: {
    averagePrice: 20000,
    priceTrackerUrl: 'https://coinmarketcap.com/currencies/bitcoin/',
  },
  ETH: {
    averagePrice: 1400,
    priceTrackerUrl: 'https://coinmarketcap.com/currencies/ethereum/',
  },
  EGLD: {
    averagePrice: 60,
    priceTrackerUrl: 'https://coinmarketcap.com/currencies/elrond-egld/',
  },
  HBAR: {
    averagePrice: 0.07,
    priceTrackerUrl: 'https://coinmarketcap.com/currencies/hedera/',
  },
  MATIC: {
    averagePrice: 0.89,
    priceTrackerUrl: 'https://coinmarketcap.com/currencies/polygon/',
  },
};

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  userRepo: Repository<User>;
  transactionRepo: Repository<Transaction>;
  assetRepo: Repository<Asset>;
  transactionInfoRepo: Repository<TransactionInfo>;
  portfolioRepo: Repository<Portfolio>;

  buildSeeder() {
    this.logger.log('Getting repositories...');
    this.userRepo = getRepository(User);
    this.transactionRepo = getRepository(Transaction);
    this.assetRepo = getRepository(Asset);
    this.transactionInfoRepo = getRepository(TransactionInfo);
    this.portfolioRepo = getRepository(Portfolio);
  }

  async cleanDatabase() {
    this.logger.log('Clean database...');
    await this.userRepo.delete({});
    await this.transactionRepo.delete({});
    await this.assetRepo.delete({});
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

  async seedAssets(users: User[]) {
    this.logger.log('Seed asset...');

    for (const user of users) {
      for (const assetName of Object.keys(assetDatas)) {
        const asset = new Asset();
        asset.name = assetName;
        asset.priceTrackerUrl = assetDatas[assetName].priceTrackerUrl;
        asset.user = user;
        await this.assetRepo.save(asset);
      }
    }
  }

  async getRandomPortfolio(user: User, expectPortfolioId: number = -1) {
    const portfolios = await this.portfolioRepo.find({
      where: { user: { id: user.id }, id: Not(expectPortfolioId) },
    });
    return faker.random.arrayElement(portfolios);
  }

  async getRandomAsset(user: User, expectAssetId: number = -1) {
    const assets = await this.assetRepo.find({
      where: { id: Not(expectAssetId) },
    });
    return faker.random.arrayElement(assets);
  }

  async seedTransactions(users: User[]) {
    this.logger.log('Seed transactions...');

    for (const user of users) {
      for (let i = 0; i < SEED_TRANSACTIONS_BY_USER; i++) {
        const fromPortfolio = await this.getRandomPortfolio(user);
        const toPortfolio = await this.getRandomPortfolio(user, fromPortfolio.id);
        const fromAsset = await this.getRandomAsset(user);
        const toAsset = await this.getRandomAsset(user, fromAsset.id);
        const feeAsset = await this.getRandomAsset(user);
        const fromData = assetDatas[fromAsset.name];
        const toData = assetDatas[toAsset.name];

        const transactionInfoFrom = new TransactionInfo();
        transactionInfoFrom.price = faker.datatype.float({ min: 0.1, max: 2 }) * fromData.averagePrice;
        transactionInfoFrom.portfolio = fromPortfolio;
        transactionInfoFrom.asset = fromAsset;
        transactionInfoFrom.amount = faker.datatype.float({ min: 0.1, max: 2 });

        const transactionInfoTo = new TransactionInfo();
        transactionInfoTo.price = faker.datatype.float({ min: 0.1, max: 2 }) * toData.averagePrice;
        transactionInfoTo.portfolio = toPortfolio;
        transactionInfoTo.asset = toAsset;
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
        transaction.feePrice = 1;
        transaction.feeAmount = faker.datatype.float({
          min: 0,
          max: 30,
        });
        transaction.feeAsset = feeAsset;
        await this.transactionRepo.save(transaction);
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
    await this.seedAssets(seededUsers);
    await this.seedPortfolio(seededUsers);
    await this.seedTransactions(seededUsers);
  }
}
