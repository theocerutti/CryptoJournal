import { User } from '../model/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { getRepository, Not, Repository } from 'typeorm';
import * as faker from 'faker';
import { Portfolio } from '../model/portfolio.entity';
import { TransactionV2 } from '../model/transactionv2.entity';
import { TransactionInfo } from '../model/transaction-info.entity';

const SEED_USER = 5;
const SEED_TRANSACTIONS_BY_USER = 100;

const portfolioNames = ['My Bank', 'Binance', 'Ledger', 'Bybit', 'RealT'];
const feesCurrency = ['EUR', 'USD'];

const investmentsDatas: {
  [key: string]: { averagePrice: number; priceLink: string };
} = {
  BTC: {
    averagePrice: 20000,
    priceLink: 'https://coinmarketcap.com/currencies/bitcoin/',
  },
  ETH: {
    averagePrice: 1400,
    priceLink: 'https://coinmarketcap.com/currencies/ethereum/',
  },
  EGLD: {
    averagePrice: 60,
    priceLink: 'https://coinmarketcap.com/currencies/elrond-egld/',
  },
  HBAR: {
    averagePrice: 0.07,
    priceLink: 'https://coinmarketcap.com/currencies/hedera/',
  },
  MATIC: {
    averagePrice: 0.89,
    priceLink: 'https://coinmarketcap.com/currencies/polygon/',
  },
};

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  userRepo: Repository<User>;
  transactionV2Repo: Repository<TransactionV2>;
  transactionInfoRepo: Repository<TransactionInfo>;
  portfolioRepo: Repository<Portfolio>;

  buildSeeder() {
    this.logger.log('Getting repositories...');
    this.userRepo = getRepository(User);
    this.transactionV2Repo = getRepository(TransactionV2);
    this.transactionInfoRepo = getRepository(TransactionInfo);
    this.portfolioRepo = getRepository(Portfolio);
  }

  async cleanDatabase() {
    this.logger.log('Clean database...');
    await this.userRepo.delete({});
    await this.transactionV2Repo.delete({});
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
        portfolio.user = user;
        portfolio.name = portfolioName;
        portfolio.description = faker.lorem.lines(1);
        await this.portfolioRepo.save(portfolio);
      }
    }
  }

  async getRandomPortfolio(user: User, expectPortfolioId: number = -1) {
    const portfolios = await this.portfolioRepo.find({
      where: { user: { id: user.id }, id: Not(expectPortfolioId) },
    });
    return faker.random.arrayElement(portfolios);
  }

  async seedTransactionsV2(users: User[]) {
    this.logger.log('Seed transactions v2...');

    for (const user of users) {
      for (let i = 0; i < SEED_TRANSACTIONS_BY_USER; i++) {
        const fromPortfolio = await this.getRandomPortfolio(user);
        const toPortfolio = await this.getRandomPortfolio(user, fromPortfolio.id);

        const fromCurrency = faker.random.arrayElement(Object.keys(investmentsDatas));
        // get toCurrency different from fromCurrency
        const toCurrency = faker.random.arrayElement(
          Object.keys(investmentsDatas).slice(Object.keys(investmentsDatas).indexOf(fromCurrency))
        );
        const fromData = investmentsDatas[fromCurrency];
        const toData = investmentsDatas[toCurrency];

        const transactionInfoFrom = new TransactionInfo();
        transactionInfoFrom.amount = faker.datatype.float({ min: 0.1, max: 2 }) * fromData.averagePrice;
        transactionInfoFrom.priceLink = fromData.priceLink;
        transactionInfoFrom.portfolio = fromPortfolio;
        transactionInfoFrom.currency = fromCurrency;

        const transactionInfoTo = new TransactionInfo();
        transactionInfoTo.amount = faker.datatype.float({ min: 0.1, max: 2 }) * toData.averagePrice;
        transactionInfoTo.priceLink = toData.priceLink;
        transactionInfoTo.portfolio = toPortfolio;
        transactionInfoTo.currency = toCurrency;

        const [transactionInfoFromSaved, transactionInfoToSaved] = await this.transactionInfoRepo.save([
          transactionInfoFrom,
          transactionInfoTo,
        ]);

        const transaction = new TransactionV2();
        transaction.to = transactionInfoToSaved;
        transaction.from = transactionInfoFromSaved;
        transaction.note = faker.lorem.lines(3);
        transaction.user = user;
        transaction.date = faker.date.past();
        transaction.fees = faker.datatype.float({
          min: 0,
          max: 30,
        });
        transaction.feesCurrency = faker.random.arrayElement(feesCurrency);
        await this.transactionV2Repo.save(transaction);
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
    await this.seedTransactionsV2(seededUsers);
  }
}
