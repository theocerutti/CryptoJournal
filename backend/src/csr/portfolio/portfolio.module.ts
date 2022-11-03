import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { Portfolio } from '../../model/portfolio.entity';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PortfolioRepository } from './portfolio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, PortfolioRepository]), forwardRef(() => UserModule)],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
