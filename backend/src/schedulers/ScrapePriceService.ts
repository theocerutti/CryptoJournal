import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { scrapePrice } from '../utils/scrape';
import { ConfigService } from '@nestjs/config';
import { ScrapeDataContainer } from './ScrapeDataContainer';
import { AssetService } from '../csr/asset/asset.service';
import { ScrapeData, scrapeRegex } from '../shared/scrape';

@Injectable()
export class ScrapePriceService {
  private readonly logger = new Logger(ScrapePriceService.name);

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => AssetService))
    private assetService: AssetService
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'scrapePrice',
  })
  async scrapePrices() {
    const prices: ScrapeData = {};
    const assets = await this.assetService.getDistinctAssetFromName();

    for (const asset of assets) {
      const priceTrackerUrl = asset.priceTrackerUrl;
      const url = new URL(priceTrackerUrl);
      const regex = scrapeRegex[url.hostname];
      if (regex) {
        prices[asset.name] = await scrapePrice(priceTrackerUrl, regex);
      } else {
        this.logger.error('No regex found for ' + priceTrackerUrl);
      }
    }
    ScrapeDataContainer.getInstance().setData(prices);
  }
}
