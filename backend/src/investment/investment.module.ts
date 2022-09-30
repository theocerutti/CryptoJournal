import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Investment } from 'model/investment.entity';
import { InvestmentController } from './investment.controller';
import { InvestmentRepository } from './investment.repository';
import { InvestmentService } from './investment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Investment, InvestmentRepository])],
  controllers: [InvestmentController],
  providers: [InvestmentService],
  exports: [InvestmentService],
})
export class InvestmentModule {}
