import { User } from 'model/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetRepository } from './asset.repository';
import { Asset } from '../../model/asset.entity';
import { CreateAssetDto, UpdateAssetDto } from '../../shared/asset';
import HttpError from '../../exceptions/http.error';

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

    // TODO: is it possible to make this constraint in the DB?
    if ((await this.AssetRepo.findOne({ where: { name: asset.name, user: { id: user.id } } })) !== undefined)
      throw new HttpError("Asset with name '" + asset.name + "' already exists", null, HttpStatus.UNPROCESSABLE_ENTITY);
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
