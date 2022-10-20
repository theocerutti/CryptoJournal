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
import { InvestmentController } from './investment.controller';

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
    const _investments = await this.getAll(user.id);
    const investments = _investments.map((i) =>
      InvestmentController.mapInvestmentToGetDto(i)
    );
    globalInfo.investmentCount = investments.length;
    globalInfo.hasScrapedPrices =
      ScrapeDataContainer.getInstance().hasScrapedPrices();
    // TODO
    globalInfo.infoByName = investments.reduce(
      (acc: InvestmentInfoByNames, investment) => {
        if (!acc[investment.name])
          acc[investment.name] = {
            count: 1,
            totalInvested: investment.investedAmount,
            totalFees: investment.fees,
            totalBalance: investment.total,
            pnl: 0,
            pnlPercent: 0,
            averageBuyPrice: 0,
            minBuyPrice: investment.buyPrice,
            maxBuyPrice: investment.buyPrice,
            minSellPrice: investment.sellPrice,
            maxSellPrice: investment.sellPrice,
          };
        acc[investment.name].count += 1;
        acc[investment.name].totalInvested += investment.investedAmount;
        acc[investment.name].totalFees += investment.fees;
        acc[investment.name].totalBalance += investment.total;
        acc[investment.name].minBuyPrice =
          investment.buyPrice < acc[investment.name].maxBuyPrice
            ? investment.buyPrice
            : acc[investment.name].maxBuyPrice;
        acc[investment.name].maxBuyPrice =
          investment.buyPrice > acc[investment.name].maxBuyPrice
            ? investment.buyPrice
            : acc[investment.name].maxBuyPrice;
        acc[investment.name].minSellPrice =
          investment.sellPrice < acc[investment.name].maxSellPrice
            ? investment.sellPrice
            : acc[investment.name].maxSellPrice;
        acc[investment.name].maxSellPrice =
          investment.sellPrice > acc[investment.name].maxSellPrice
            ? investment.sellPrice
            : acc[investment.name].maxSellPrice;
        return acc;
      },
      {}
    );
    // then calculate average, pnl..
    for (let i = 0; i < Object.keys(globalInfo.infoByName).length; i++) {
      const key = Object.keys(globalInfo.infoByName)[i];
      const info = globalInfo.infoByName[key];
      info.averageBuyPrice = info.totalInvested / info.count;
      info.pnl = info.totalBalance - info.totalInvested;
      info.pnlPercent = (info.pnl / info.totalInvested) * 100;
    }

    globalInfo.investmentNameCount = Object.keys(globalInfo.infoByName).length;
    globalInfo.totalInvested = await this.TransactionRepo.getTotalInvested(
      user
    );
    globalInfo.totalFees = await this.InvestmentRepo.getTotalFees(user);
    globalInfo.pnl = 0;
    globalInfo.totalBalance = 0;

    if (Object.keys(scrapeData).length > 0) {
      for (const investment of investments)
        globalInfo.totalBalance += investment.total;
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
