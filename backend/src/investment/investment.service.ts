import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestmentRepository } from './investment.repository';
import { Investment } from '../model/investment.entity';
import {
  CreateInvestmentDto,
  InvestmentGlobalInfoDto,
  UpdateInvestmentDto,
} from '../shared/investment';
import { User } from '../model/user.entity';
import { UserService } from '../user/user.service';
import { ScrapeDataContainer } from '../schedulers/ScrapeDataContainer';
import { TransactionRepository } from '../transaction/transaction.repository';
import { InvestmentInfoByNames } from '../shared/investment/investment-global-info.dto';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(InvestmentRepository)
    private readonly InvestmentRepo: InvestmentRepository,
    @InjectRepository(TransactionRepository)
    private readonly TransactionRepo: TransactionRepository,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {}

  async getAll(userId: number): Promise<Investment[]> {
    return this.InvestmentRepo.find({
      where: { user: { id: userId } },
    });
  }

  async get(userId: number, investmentId: number): Promise<Investment> {
    return await this.InvestmentRepo.findOne({
      relations: ['user'],
      where: { user: { id: userId }, id: investmentId },
    });
  }

  async getGlobalInfo(user: User): Promise<InvestmentGlobalInfoDto> {
    const globalInfo = new InvestmentGlobalInfoDto();
    const scrapeData = ScrapeDataContainer.getInstance().getData();
    const investments = await this.getAll(user.id);
    globalInfo.investmentCount = investments.length;
    globalInfo.hasScrapedPrices =
      ScrapeDataContainer.getInstance().hasScrapedPrices();
    // TODO
    globalInfo.infoByName = investments.reduce(
      (acc: InvestmentInfoByNames, investment) => {
        if (!acc[investment.name])
          acc[investment.name] = {
            count: 1,
            totalInvested: 1,
            totalFees: 1,
            totalBalance: 1,
            pnl: 1,
            pnlPercent: 1,
            averageBuyPrice: 18013,
            minBuyPrice: 17034,
            maxBuyPrice: 47344,
            minSellPrice: 1,
            maxSellPrice: 1,
          };
        acc[investment.name].count += 1;
        acc[investment.name].totalInvested += 1;
        acc[investment.name].totalFees += 1;
        acc[investment.name].totalBalance += 1;
        acc[investment.name].pnl += 1;
        acc[investment.name].pnlPercent += 1;
        acc[investment.name].averageBuyPrice += 1;
        acc[investment.name].minBuyPrice += 1;
        acc[investment.name].maxBuyPrice += 1;
        acc[investment.name].minSellPrice += 1;
        acc[investment.name].maxSellPrice += 1;
        return acc;
      },
      {}
    );
    globalInfo.investmentNameCount = Object.keys(globalInfo.infoByName).length;
    globalInfo.totalInvested = await this.TransactionRepo.getTotalInvested(
      user
    );
    globalInfo.totalFees = await this.InvestmentRepo.getTotalFees(user);
    globalInfo.pnl = 0;
    globalInfo.totalBalance = 0;

    if (Object.keys(scrapeData).length > 0) {
      for (const investment of investments) {
        const price = scrapeData[investment.priceLink];
        if (price) {
          globalInfo.totalBalance += price * investment.holdings;
        }
      }
      globalInfo.pnl = globalInfo.totalBalance - globalInfo.totalInvested;
      globalInfo.pnlPercent = (globalInfo.pnl / globalInfo.totalInvested) * 100;
    }
    return globalInfo;
  }

  async create(
    user: User,
    investmentDto: CreateInvestmentDto
  ): Promise<Investment> {
    const investment = new Investment();
    Object.assign(investment, investmentDto);
    investment.user = user;
    return await this.InvestmentRepo.save(investment);
  }

  async update(
    userId: number,
    investmentDto: UpdateInvestmentDto
  ): Promise<Investment> {
    const investment = await this.get(userId, investmentDto.id);
    const updated = Object.assign(investment, investmentDto);
    return await this.InvestmentRepo.save(updated);
  }

  async delete(userId: number, investmentId: number): Promise<Investment> {
    const investment = await this.get(userId, investmentId);
    return await this.InvestmentRepo.remove(investment);
  }

  async getDistinctPriceLinks(): Promise<string[]> {
    return await this.InvestmentRepo.getDistinct('priceLink');
  }
}
