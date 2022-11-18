import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seeder } from './seeder';
import { UserModule } from '../csr/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../csr/auth/auth.module';
import { PortfolioModule } from '../csr/portfolio/portfolio.module';
import { TransactionModule } from '../csr/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `src/${process.env.NODE_ENV === 'production' ? '.env.prod' : '.env'}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      synchronize: process.env.NODE_ENV !== 'production',
      autoLoadEntities: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
    AuthModule,
    PortfolioModule,
    TransactionModule,
  ],
  providers: [Seeder],
})
export class SeederModule {}
