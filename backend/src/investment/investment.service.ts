import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvestmentRepository } from './investment.repository';
import { Investment } from '../model/investment.entity';
import { InvestmentDto } from '../shared/investment';
import { User } from '../model/user.entity';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(InvestmentRepository)
    private readonly InvestmentRepo: InvestmentRepository
  ) {}

  async getAll(userId: number): Promise<Investment[]> {
    return this.InvestmentRepo.find({ where: { user: { id: userId } } });
  }

  async get(userId: number, investmentId: number): Promise<Investment> {
    return this.InvestmentRepo.findOne({
      relations: ['user'],
      where: { user: { id: userId }, id: investmentId },
    });
  }

  async create(user: User, investmentDto: InvestmentDto): Promise<Investment> {
    delete investmentDto.id;

    const investment = new Investment();
    Object.assign(investment, investmentDto);
    investment.user = user;
    return await this.InvestmentRepo.save(investment);
  }

  async update(
    userId: number,
    investmentDto: InvestmentDto
  ): Promise<Investment> {
    const investment = await this.get(userId, investmentDto.id);
    const updated = Object.assign(investment, investmentDto);
    return await this.InvestmentRepo.save(updated);
  }

  async delete(userId: number, investmentId: number): Promise<Investment> {
    const investment = await this.get(userId, investmentId);
    return await this.InvestmentRepo.remove(investment);
  }
}
