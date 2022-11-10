import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GlobalInfoDto } from '../../shared/global-info';
import { ScrapeDataContainer } from '../../schedulers/ScrapeDataContainer';
import { TransactionService } from '../transaction/transaction.service';
import { AssetService } from '../asset/asset.service';
import { GlobalInfoAssetDto } from '../../shared/global-info/global-info.dto';
import { Asset } from '../../model/asset.entity';

@Injectable()
export class GlobalInfoService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
    @Inject(forwardRef(() => AssetService))
    private assetService: AssetService
  ) {}

  async buildInfo(userId: number): Promise<GlobalInfoDto> {
    const globalInfo = new GlobalInfoDto();
    const assets = await this.assetService.getAll(userId);

    globalInfo.hasScrapedPrices = ScrapeDataContainer.getInstance().hasScrapedPrices();
    globalInfo.pnl = await this.transactionService.getPNL(userId);
    globalInfo.pnlPercent = await this.transactionService.getPNLPercent(userId);
    globalInfo.totalBalance = await this.transactionService.getTotalBalance(userId);
    globalInfo.totalFees = await this.transactionService.getTotalFees(userId);
    globalInfo.totalInvested = await this.transactionService.getTotalInvested(userId);
    globalInfo.globalInfoAssets = {};

    for (const asset of assets) globalInfo.globalInfoAssets[asset.name] = await this.buildAssetInfo(userId, asset);
    return globalInfo;
  }

  async buildAssetInfo(userId: number, asset: Asset): Promise<GlobalInfoAssetDto> {
    const assetInfo = new GlobalInfoAssetDto();
    assetInfo.amount = await this.transactionService.getTotalAmountAsset(userId, asset);
    assetInfo.fees = await this.transactionService.getTotalFeesAsset(userId, asset);
    assetInfo.pnl = await this.transactionService.getPNLAsset(userId, asset);
    assetInfo.pnlPercent = await this.transactionService.getPNLPercentAsset(userId, asset);
    assetInfo.totalBalance = await this.transactionService.getTotalBalanceAsset(userId, asset);
    return assetInfo;
  }
}
