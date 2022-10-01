import { ScrapeData } from '../shared/investment/scrape';

export class ScrapeDataContainer {
  private data: ScrapeData = {};
  private static instance: ScrapeDataContainer;

  public static getInstance(): ScrapeDataContainer {
    if (!ScrapeDataContainer.instance) {
      ScrapeDataContainer.instance = new ScrapeDataContainer();
    }

    return ScrapeDataContainer.instance;
  }

  public setData(data: ScrapeData) {
    this.data = data;
  }

  public getPrice(link: string): number | null {
    return this.data[link] ? this.data[link] : null;
  }

  public getData() {
    return this.data;
  }
}
