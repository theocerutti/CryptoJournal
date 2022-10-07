import { User } from '../model/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import * as faker from 'faker';
import { Investment } from '../model/investment.entity';

const SEED_USER = 5;
const SEED_INVESTMENT_BY_USER = 100;

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
};

const locationNames = [
  'Kraken',
  'Binance',
  'Coinbase',
  'Bitstamp',
  'Bitfinex',
  'BourseDirect',
  'TradeRepublic',
];

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  userRepo: Repository<User>;
  investmentRepo: Repository<Investment>;

  buildSeeder() {
    this.logger.log('Getting repositories...');
    this.userRepo = getRepository(User);
    this.investmentRepo = getRepository(Investment);
  }

  async cleanDatabase() {
    this.logger.log('Clean database...');
    await this.userRepo.delete({});
    await this.investmentRepo.delete({});
  }

  async seedUsers(): Promise<User[]> {
    this.logger.log('Seed users...');
    const users = [];

    for (let i = 0; i < SEED_USER; i++) {
      const user = new User();
      user.email = faker.internet.email();
      user.password = 'password';
      users.push(user);
    }
    const user = new User();
    user.email = 'user@gmail.com';
    user.password = 'password';
    users.push(user);
    return await this.userRepo.save(users);
  }

  async seedInvestments(users: User[]) {
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    for (const user of users) {
      for (let i = 0; i < SEED_INVESTMENT_BY_USER; i++) {
        for (const [key, value] of Object.entries(investmentsDatas)) {
          const investment = new Investment();
          investment.user = user;
          investment.buyDate = faker.date.between(yearAgo, new Date());
          investment.sellDate = null;
          investment.buyPrice =
            faker.datatype.float({ min: 0.1, max: 2 }) * value.averagePrice; // add/remove between -90% and 100% of the average price
          investment.sellPrice = null;
          investment.buyNote = faker.lorem.lines(3);
          investment.sellNote = null;
          investment.name = key;
          investment.fees = faker.datatype.float({
            min: 0,
            max: 10,
            precision: 2,
          });
          investment.investedAmount = faker.datatype.float({
            min: 50,
            max: 1000,
          });
          investment.holdings = investment.investedAmount / investment.buyPrice;
          investment.locationName =
            locationNames[faker.datatype.number(locationNames.length - 1)];
          investment.primaryTag = key;
          investment.secondaryTag = 'Crypto';
          investment.priceLink = value.priceLink;

          // add sell investments
          if (i % 2 === 0) {
            investment.sellDate = faker.date.soon(
              faker.datatype.number({ min: 1, max: 365 }),
              investment.buyDate
            );
            investment.sellNote = faker.lorem.lines(3);
            // win investment
            if (i % 3 === 0) {
              investment.sellPrice = faker.datatype.number({
                min: investment.buyPrice,
                max:
                  investment.buyPrice +
                  (value.averagePrice / 5) *
                    faker.datatype.float({ min: 0.1, max: 2 }),
              });
            }
            // loose investment
            else {
              investment.sellPrice = faker.datatype.number({
                min:
                  investment.buyPrice -
                  (value.averagePrice / 5) *
                    faker.datatype.float({ min: 0.1, max: 2 }),
                max: investment.buyPrice,
              });
            }
          }
          await this.investmentRepo.save(investment);
        }
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
    await this.seedInvestments(seededUsers);
  }
}
