export type CMCCryptoBasicInfos = { [cryptoId: string]: CMCCryptoBasicInfo };

export type CMCCryptoBasicInfo = {
  id: number;
  name: string;
  symbol: string;
  logo: string;
};

export type CMCQuotesLatest = {
  data: CMCQuoteLatestData;
  status: CMCStatus;
};

export type CMCQuoteLatestData = { [cryptoId: string]: CMCQuoteLatest };

export type CMCQuoteLatest = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  is_active: number;
  is_fiat: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  date_added: string;
  num_market_pairs: number;
  cmc_rank: number;
  last_updated: string;
  tags: string[];
  platform: string | null;
  self_reported_circulating_supply: number;
  self_reported_market_cap: number;
  quote: CMCQuotes;
};

export type CMCCryptoMap = {
  data: {
    id: number;
    rank: number;
    name: string;
    symbol: string;
    slug: string;
    is_active: number;
    first_historical_data: string;
    last_historical_data: string;
    platform: string | null;
  }[];
  status: CMCStatus;
};

export type CMCQuotes = { [crypto: string]: CMCQuote };

export type CMCQuote = {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  last_updated: string;
};

export type CMCStatus = {
  timestamp: string;
  error_code: number;
  error_message: string | null;
  elapsed: number;
  credit_count: number;
  notice: string | null;
} | null;
