export enum ScrapeSite {
  CoinMarketCap = 'coinmarketcap.com',
  Investing = 'investing.com',
  JustEtf = 'justetf.com', // TODO: scrape price in EUR.. need to convert to USD
}

export type ScrapeRegex = string;

export type ScrapeDatas = {
  [assetName: string]: ScrapeData;
};

export type ScrapeData = {
  price: number;
  logoUrl: string | null;
};

export const scrapeRegex: { [site in ScrapeSite]: ScrapeRegexTable } = {
  [ScrapeSite.CoinMarketCap]: {
    price: '<div(?=[^>]*class="priceValue.*")[^>]*>[^>]*<span(?=[^>]*)[^>]*>(.+?)</span>',
    logoURL: '<div(?=[^>]*class=".*nameHeader")[^>]*>[^>]*<img.*src="(.+?)".*>',
  },
  [ScrapeSite.Investing]: {
    price: '<span(?=[^>]*id="last_last")[^>]*>(.+?)</span>',
    logoURL: null,
  },
  [ScrapeSite.JustEtf]: {
    price: '<div(?=[^>]*class="val.*")[^>]*>[^>]*<span(?=[^>]*)[^>]*>.+?</span>[^>]*<span(?=[^>]*)[^>]*>(.+?)</span>',
    logoURL: null,
  },
};

export type ScrapeRegexTable = {
  price: ScrapeRegex;
  logoURL: ScrapeRegex | null;
};
