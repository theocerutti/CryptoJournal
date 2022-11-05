import { forwardRef, Module } from '@nestjs/common';
import { ScrapePriceService } from './ScrapePriceService';
import { ConfigModule } from '@nestjs/config';
import { AssetModule } from '../csr/asset/asset.module';

@Module({
  imports: [forwardRef(() => AssetModule), ConfigModule],
  providers: [ScrapePriceService],
  exports: [ScrapePriceService],
})
export class TasksModule {}
