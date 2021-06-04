
import axios, { AxiosInstance } from 'axios';

class CoinService {

  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string = 'https://api.coingecko.com/api/v3';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-type': 'application/json'
      }
    });
  }

  load(): Promise<any> {
    return this.axiosInstance.get(`${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
  }

  loadOne(id: string): Promise<any> {
    const url = `${this.baseUrl}/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;
    return this.axiosInstance.get(url);
  }

  getChart(id: string) {
    const url = `${this.baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`;
    return this.axiosInstance.get(url);
  }

}

export default new CoinService();