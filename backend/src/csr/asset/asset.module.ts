import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { User } from 'model/user.entity';
import { AssetRepository } from './asset.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, AssetRepository])],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
