import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GlobalInfoAssetDto, GlobalInfoDto } from '../../shared/global-info';
import { TransactionService } from '../transaction/transaction.service';
import { CoinMarketCapService } from '../coinmarketcap/coinmarketcap.service';
import { CMCQuoteLatestData } from '../../shared/coinmarketcap';

@Injectable()
export class GlobalInfoService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
    @Inject(forwardRef(() => CoinMarketCapService))
    private coinMarketCapService: CoinMarketCapService
  ) {}

  async buildInfo(userId: number): Promise<GlobalInfoDto> {
    const globalInfo = new GlobalInfoDto();
    const assetIds = await this.transactionService.getAllAssetId(userId);

    if (assetIds.length === 0) {
      return globalInfo;
    }

    const assetQuotes = await this.coinMarketCapService.getCryptoQuotes(assetIds);

    globalInfo.pnl = await this.transactionService.getPNL(userId, assetQuotes);
    globalInfo.pnlPercent = await this.transactionService.getPNLPercent(userId, assetQuotes);
    globalInfo.totalBalance = await this.transactionService.getTotalBalance(userId, assetQuotes);
    globalInfo.totalFees = await this.transactionService.getTotalFees(userId);
    globalInfo.totalInvested = await this.transactionService.getTotalInvested(userId);
    globalInfo.globalInfoAssets = [];

    for (const assetId of assetIds)
      globalInfo.globalInfoAssets.push(await this.buildAssetInfo(userId, assetId, assetQuotes));
    return globalInfo;
  }

  async buildAssetInfo(userId: number, assetId: number, assetQuotes: CMCQuoteLatestData): Promise<GlobalInfoAssetDto> {
    const assetInfo = new GlobalInfoAssetDto();
    assetInfo.id = assetId;
    assetInfo.amount = await this.transactionService.getTotalAmountAsset(userId, assetId);
    assetInfo.fees = await this.transactionService.getTotalFeesAsset(userId, assetId);
    assetInfo.totalBalance = await this.transactionService.getTotalBalanceAsset(userId, assetId, assetQuotes);
    assetInfo.name = assetQuotes[assetId].name;
    assetInfo.symbol = assetQuotes[assetId].symbol;
    assetInfo.price = assetQuotes[assetId].quote['USD'].price;
    assetInfo.logo = this.coinMarketCapService.getCryptoLogo(assetId);
    return assetInfo;
  }
}
