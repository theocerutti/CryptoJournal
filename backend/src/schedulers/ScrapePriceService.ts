import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { scrape } from '../utils/scrape';
import { ConfigService } from '@nestjs/config';
import { ScrapeDataContainer } from './ScrapeDataContainer';
import { AssetService } from '../csr/asset/asset.service';
import { ScrapeDatas, scrapeRegex, ScrapeSite } from '../shared/scrape';

@Injectable()
export class ScrapePriceService {
  private readonly logger = new Logger(ScrapePriceService.name);

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => AssetService))
    private assetService: AssetService
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'scrapeDatas',
  })
  async scrapesData() {
    const data: ScrapeDatas = {};
    const assets = await this.assetService.getDistinctAssetFromName();

    for (const asset of assets) {
      const priceTrackerUrl = asset.priceTrackerUrl;
      const url = new URL(priceTrackerUrl);
      const priceRegex = scrapeRegex[url.hostname as ScrapeSite].price;

      let price = 0;
      let logoUrl = ScrapeDataContainer.getInstance().getLogoURL(asset.name);

      if (priceRegex) {
        price = (await scrape(priceTrackerUrl, priceRegex)) as number;
      } else {
        this.logger.error('No regex found for ' + priceTrackerUrl);
      }

      const logoURLRegex = scrapeRegex[url.hostname as ScrapeSite].logoURL;
      if (logoURLRegex && !logoUrl) {
        logoUrl = (await scrape(priceTrackerUrl, logoURLRegex, 0, false)) as string;
      }

      data[asset.name] = {
        price,
        logoUrl,
      };
    }
    ScrapeDataContainer.getInstance().setData(data);
  }
}
