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

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'scrapePrice',
  })
  async scrapePrices() {
    const prices: ScrapeData = {};
    const links = await this.assetService.getDistinctPriceTrackerUrls();

    for (const link of links) {
      const url = new URL(link);
      const regex = scrapeRegex[url.hostname];
      if (regex) {
        prices[link] = await scrapePrice(link, regex);
      } else {
        this.logger.error('No regex found for ' + link);
      }
    }
    ScrapeDataContainer.getInstance().setData(prices);
  }
}
