import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoinService {

  private readonly baseUrl: string = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) { }

  load(): Promise<any> {
    return this.http.get(`${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
      .toPromise();
  }

  loadOne(id: string): Promise<any> {
    const url = `${this.baseUrl}/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;
    return this.http.get(url).toPromise();
  }

  getChart(id: string) {
    const url = `${this.baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`;
    return this.http.get(url).toPromise();
  }

}
