import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvestmentService } from '../investment/investment.service';
import { scrapePrice } from '../utils/scrape';
import { scrapeRegex } from '../investment/scrape-table';
import { ConfigService } from '@nestjs/config';
import { ScrapeData } from '../shared/investment/scrape';
import { ScrapeDataContainer } from './ScrapeDataContainer';

@Injectable()
export class ScrapePriceService {
  private readonly logger = new Logger(ScrapePriceService.name);

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => InvestmentService))
    private investmentService: InvestmentService
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'scrapePrice',
  })
  async handleCron() {
    this.logger.log('Scrape Prices');
    const prices: ScrapeData = {};
    const links = await this.investmentService.getDistinctPriceLinks();

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