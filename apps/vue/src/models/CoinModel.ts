export interface CoinModel {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: string;
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  usd_market_cap: number;
  last_updated_at: number;
}