export enum ScrapeSite {
  CoinMarketCap = 'coinmarketcap.com',
  Investing = 'investing.com',
  JustEtf = 'justetf.com', // TODO: scrape price in EUR.. need to convert to USD
}

export type ScrapeRegex = string;

export type ScrapeData = {
  [assetName in string]: number;
};

export const scrapeRegex: Record<ScrapeSite, ScrapeRegex> = {
  [ScrapeSite.CoinMarketCap]: '<div(?=[^>]*class="priceValue.*")[^>]*>[^>]*<span(?=[^>]*)[^>]*>(.+?)</span>',
  [ScrapeSite.Investing]: '<span(?=[^>]*id="last_last")[^>]*>(.+?)</span>',
  [ScrapeSite.JustEtf]:
    '<div(?=[^>]*class="val.*")[^>]*>[^>]*<span(?=[^>]*)[^>]*>.+?</span>[^>]*<span(?=[^>]*)[^>]*>(.+?)</span>',
};
