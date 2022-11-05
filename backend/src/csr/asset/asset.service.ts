import { User } from 'model/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetRepository } from './asset.repository';
import { Asset } from '../../model/asset.entity';
import { CreateAssetDto, UpdateAssetDto } from '../../shared/asset';

@Injectable()
export class AssetService {
  constructor(@InjectRepository(AssetRepository) private readonly AssetRepo: AssetRepository) {}

  async getDistinctPriceTrackerUrls(): Promise<string[]> {
    return await this.AssetRepo.getDistinct('priceTrackerUrl');
  }

  async getAll(userId: number): Promise<Asset[]> {
    return this.AssetRepo.find({
      where: { user: { id: userId } },
    });
  }

  async get(userId: number, assetId: number): Promise<Asset> {
    return await this.AssetRepo.findOne({
      relations: ['user'],
      where: { user: { id: userId }, id: assetId },
    });
  }

  async create(user: User, assetDto: CreateAssetDto): Promise<Asset> {
    const asset = new Asset();
    Object.assign(asset, assetDto);
    asset.user = user;
    return await this.AssetRepo.save(asset);
  }

  async update(userId: number, assetDto: UpdateAssetDto): Promise<Asset> {
    const asset = await this.get(userId, assetDto.id);
    const updated = Object.assign(asset, assetDto);
    return await this.AssetRepo.save(updated);
  }

  async delete(userId: number, assetId: number): Promise<Asset> {
    const asset = await this.get(userId, assetId);
    return await this.AssetRepo.remove(asset);
  }
}
