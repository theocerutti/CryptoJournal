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

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(InvestmentRepository)
    private readonly InvestmentRepo: InvestmentRepository,
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
    globalInfo.totalInvested = await this.InvestmentRepo.getTotalInvested(user);
    globalInfo.totalFees = await this.InvestmentRepo.getTotalFees(user);
    globalInfo.pnl = 0;
    globalInfo.totalBalance = 0;

    if (Object.keys(scrapeData).length > 0) {
      const investments = await this.getAll(user.id);

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
