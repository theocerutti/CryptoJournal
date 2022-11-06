import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { User } from 'model/user.entity';
import { AssetService } from './asset.service';
import { CurrentUser } from 'csr/auth/current-user.decorator';
import { Asset } from '../../model/asset.entity';
import { CreateAssetDto, UpdateAssetDto } from '../../shared/asset';

@Controller('assets')
export class AssetController {
  private readonly logger = new Logger(AssetController.name);

  constructor(private assetService: AssetService) {}

  @Get()
  public async getAll(@CurrentUser() user: User): Promise<Asset[]> {
    this.logger.log(`GetAll with userId=${user.id}`);
    return await this.assetService.getAll(user.id);
  }

  @Get(':assetId')
  public async get(@CurrentUser() user: User, @Param('assetId', ParseIntPipe) assetId: number): Promise<Asset> {
    this.logger.log(`Get assetId=${assetId}`);
    return await this.assetService.get(user.id, assetId);
  }

  @Post()
  public async create(@CurrentUser() user: User, @Body() assetDTO: CreateAssetDto): Promise<Asset> {
    this.logger.log(`Create ${assetDTO}`);
    return await this.assetService.create(user, assetDTO);
  }

  @Put()
  public async update(@CurrentUser() user: User, @Body() assetDTO: UpdateAssetDto): Promise<Asset> {
    this.logger.log(`Update ${assetDTO}`);
    return await this.assetService.update(user.id, assetDTO);
  }

  @Delete(':assetId')
  public async delete(@CurrentUser() user: User, @Param('assetId', ParseIntPipe) assetId: number): Promise<Asset> {
    this.logger.log(`Delete ${assetId}`);
    return await this.assetService.delete(user.id, assetId);
  }
}
