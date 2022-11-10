import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { GlobalInfoController } from './global-info.controller';
import { GlobalInfoService } from './global-info.service';
import { TransactionModule } from '../transaction/transaction.module';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [forwardRef(() => AssetModule), forwardRef(() => TransactionModule)],
  controllers: [GlobalInfoController],
  providers: [GlobalInfoService],
  exports: [GlobalInfoService],
})
export class GlobalInfoModule {}
