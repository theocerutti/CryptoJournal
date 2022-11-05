import { ScrapeData } from '../shared/scrape';

export class ScrapeDataContainer {
  private data: ScrapeData = {};
  private _hasScrapedPrices: boolean = false;
  private static instance: ScrapeDataContainer;

  public static getInstance(): ScrapeDataContainer {
    if (!ScrapeDataContainer.instance) {
      ScrapeDataContainer.instance = new ScrapeDataContainer();
    }

    return ScrapeDataContainer.instance;
  }

  public setData(data: ScrapeData): void {
    this._hasScrapedPrices = data && Object.keys(data).length > 0;
    this.data = data;
  }

  public getPrice(link: string): number | null {
    return this.data[link] ? this.data[link] : null;
  }

  public getData(): ScrapeData {
    return this.data;
  }

  public hasScrapedPrices(): boolean {
    return this._hasScrapedPrices;
  }
}
