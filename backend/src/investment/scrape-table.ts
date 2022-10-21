import { ScrapeRegex, ScrapeSite } from '../shared/investment/scrape';

export const scrapeRegex: Record<ScrapeSite, ScrapeRegex> = {
  [ScrapeSite.CoinMarketCap]: '<div(?=[^>]*class="priceValue.*")[^>]*>[^>]*<span(?=[^>]*)[^>]*>(.+?)</span>',
  [ScrapeSite.Investing]: '<span(?=[^>]*id="last_last")[^>]*>(.+?)</span>',
  [ScrapeSite.JustEtf]: '<div(?=[^>]*class="val.*")[^>]*>[^>]*<span(?=[^>]*)[^>]*>.+?</span>[^>]*<span(?=[^>]*)[^>]*>(.+?)</span>',
};
