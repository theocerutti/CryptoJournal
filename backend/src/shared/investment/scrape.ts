export enum ScrapeSite {
  CoinMarketCap = 'coinmarketcap.com',
  Investing = 'investing.com',
  JustEtf = 'justetf.com', // TODO: scrape price in EUR.. need to convert to USD
}

export type ScrapeRegex = string;

export type ScrapeData = {
  [link in string]: number;
};
