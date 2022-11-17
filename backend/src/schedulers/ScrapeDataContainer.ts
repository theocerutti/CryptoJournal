import { ScrapeData, ScrapeDatas } from '../shared/scrape';

export class ScrapeDataContainer {
  private data: ScrapeDatas = {};
  private _hasScrapedPrices: boolean = false;
  private static instance: ScrapeDataContainer;

  public static getInstance(): ScrapeDataContainer {
    if (!ScrapeDataContainer.instance) {
      ScrapeDataContainer.instance = new ScrapeDataContainer();
    }

    return ScrapeDataContainer.instance;
  }

  public setData(data: ScrapeDatas): void {
    this._hasScrapedPrices = data && Object.keys(data).length > 0;
    this.data = data;
  }

  private get<T>(assetName, key: keyof ScrapeData): string | number {
    return this.data[assetName]?.[key] ? this.data[assetName]?.[key] : null;
  }

  public getPrice(assetName: string): number | null {
    return this.get(assetName, 'price') as number;
  }

  public getLogoURL(assetName: string): string | null {
    return this.get(assetName, 'logoUrl') as string;
  }

  public getData(): ScrapeDatas {
    return this.data;
  }

  public hasScrapedPrices(): boolean {
    return this._hasScrapedPrices;
  }
}
