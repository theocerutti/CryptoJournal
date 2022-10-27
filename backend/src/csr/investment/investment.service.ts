import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestmentRepository } from './investment.repository';
import { Investment } from '../../model/investment.entity';
import {
  CreateInvestmentDto,
  GetInvestmentDto,
  InvestmentGlobalInfoDto,
  OrderInvestmentStatus,
  UpdateInvestmentDto,
} from '../../shared/investment';
import { User } from '../../model/user.entity';
import { UserService } from '../user/user.service';
import { ScrapeDataContainer } from '../../schedulers/ScrapeDataContainer';
import { TransactionRepository } from '../transaction/transaction.repository';
import { InvestmentInfoByNames } from '../../shared/investment/investment-global-info.dto';
import { MyMath } from '../../utils/math';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(InvestmentRepository)
    private readonly InvestmentRepo: InvestmentRepository,
    @InjectRepository(TransactionRepository)
    private readonly TransactionRepo: TransactionRepository,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {}

  public static mapInvestmentToGetDto(investment: Investment): GetInvestmentDto {
    const dto = new GetInvestmentDto();
    Object.assign(dto, investment);
    let priceForCalcul = 0;

    if (dto.orderStatus === OrderInvestmentStatus.OPEN) {
      dto.price = ScrapeDataContainer.getInstance().getPrice(investment.priceLink);
      priceForCalcul = dto.price;
    } else {
      dto.price = null; // don't need to send price if order is closed
      priceForCalcul = dto.sellPrice;
    }
    dto.total = priceForCalcul * dto.holdings;
    dto.pnl = dto.total - dto.investedAmount;
    dto.pnlPercent = (dto.pnl / dto.investedAmount) * 100;
    return dto;
  }

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

  async getInfoByName(user: User): Promise<InvestmentInfoByNames> {
    const _investments = await this.getAll(user.id);
    const investments = _investments.map((i) => InvestmentService.mapInvestmentToGetDto(i));
    const infos = investments.reduce((acc: InvestmentInfoByNames, investment) => {
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
          minSellPrice: undefined,
          maxSellPrice: undefined,
        };
      acc[investment.name].count += 1;
      acc[investment.name].totalInvested += investment.investedAmount;
      acc[investment.name].totalFees += investment.fees;
      acc[investment.name].totalBalance += investment.total;
      acc[investment.name].minBuyPrice = MyMath.min(acc[investment.name].minBuyPrice, investment.buyPrice);
      acc[investment.name].maxBuyPrice = MyMath.max(acc[investment.name].maxBuyPrice, investment.buyPrice);
      if (investment.sellPrice !== null && !isNaN(investment.sellPrice) && acc[investment.name].minSellPrice !== null) {
        acc[investment.name].minSellPrice = MyMath.min(acc[investment.name].minSellPrice, investment.sellPrice);
      }
      if (investment.sellPrice !== null && !isNaN(investment.sellPrice) && acc[investment.name].maxSellPrice !== null) {
        acc[investment.name].maxSellPrice = MyMath.max(acc[investment.name].maxSellPrice, investment.sellPrice);
      }
      return acc;
    }, {});

    // then calculate average, pnl..
    for (let i = 0; i < Object.keys(infos).length; i++) {
      const name = Object.keys(infos)[i];
      const info = infos[name];
      const totalBuyPrice = investments.reduce((n, i) => n + (i.name === name ? i.buyPrice : 0), 0);
      info.averageBuyPrice = totalBuyPrice / info.count;
      info.pnl = info.totalBalance - info.totalInvested;
      info.pnlPercent = (info.pnl / info.totalInvested) * 100;
    }

    return infos;
  }

  async getGlobalInfo(user: User): Promise<InvestmentGlobalInfoDto> {
    const globalInfo = new InvestmentGlobalInfoDto();
    const scrapeData = ScrapeDataContainer.getInstance().getData();
    const _investments = await this.getAll(user.id);
    const investments = _investments.map((i) => InvestmentService.mapInvestmentToGetDto(i));
    globalInfo.investmentCount = investments.length;
    globalInfo.hasScrapedPrices = ScrapeDataContainer.getInstance().hasScrapedPrices();
    globalInfo.infoByName = await this.getInfoByName(user);

    globalInfo.investmentNameCount = Object.keys(globalInfo.infoByName).length;
    globalInfo.totalInvested = await this.TransactionRepo.getTotalInvested(user);
    globalInfo.totalFees = await this.InvestmentRepo.getTotalFees(user);
    globalInfo.pnl = 0;
    globalInfo.totalBalance = 0;

    if (Object.keys(scrapeData).length > 0) {
      for (const investment of investments) globalInfo.totalBalance += investment.total;
      globalInfo.pnl = globalInfo.totalBalance - globalInfo.totalInvested;
      globalInfo.pnlPercent = (globalInfo.pnl / globalInfo.totalInvested) * 100;
    }
    return globalInfo;
  }

  async create(user: User, investmentDto: CreateInvestmentDto): Promise<Investment> {
    const investment = new Investment();
    Object.assign(investment, investmentDto);
    investment.user = user;
    return await this.InvestmentRepo.save(investment);
  }

  async update(userId: number, investmentDto: UpdateInvestmentDto): Promise<Investment> {
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
