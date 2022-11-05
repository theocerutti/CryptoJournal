import { EntityRepository } from 'typeorm';
import { BaseEntityRepository } from '../../utils/BaseEntityRepository';
import { Asset } from '../../model/asset.entity';

@EntityRepository(Asset)
export class AssetRepository extends BaseEntityRepository<Asset> {}
