import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioRepository } from './portfolio.repository';
import { Portfolio } from '../../model/portfolio.entity';
import { User } from '../../model/user.entity';
import { UserService } from '../user/user.service';
import { CreatePortfolioDto, UpdatePortfolioDto } from '../../shared/portfolio';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(PortfolioRepository)
    private readonly PortfolioRepo: PortfolioRepository,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {}

  async getAll(userId: number): Promise<Portfolio[]> {
    return this.PortfolioRepo.find({
      where: { user: { id: userId } },
    });
  }

  async get(userId: number, portfolioId: number): Promise<Portfolio> {
    return await this.PortfolioRepo.findOne({
      relations: ['user'],
      where: { user: { id: userId }, id: portfolioId },
    });
  }

  async create(user: User, portfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const portfolio = new Portfolio();
    Object.assign(portfolio, portfolioDto);
    portfolio.user = user;
    return await this.PortfolioRepo.save(portfolio);
  }

  async update(userId: number, portfolioDto: UpdatePortfolioDto): Promise<Portfolio> {
    const portfolio = await this.get(userId, portfolioDto.id);
    const updated = Object.assign(portfolio, portfolioDto);
    return await this.PortfolioRepo.save(updated);
  }

  async delete(userId: number, portfolioId: number): Promise<Portfolio> {
    const portfolio = await this.get(userId, portfolioId);
    return await this.PortfolioRepo.remove(portfolio);
  }
}
