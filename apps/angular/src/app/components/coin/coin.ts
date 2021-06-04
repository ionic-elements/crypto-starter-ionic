import { Component, Input } from '@angular/core';
import { CoinModel } from 'src/app/models/coin-model';

@Component({
  selector: 'app-coin',
  templateUrl: 'coin.html',
  styleUrls: ['./coin.scss'],
})
export class CoinComponent {

  @Input() coin: CoinModel;

  public imageUrl: string;

  constructor() {}

  ngOnInit() {
    const symbol = this.coin.symbol.toLowerCase();
    this.imageUrl = `https://raw.githubusercontent.com/cjdowner/cryptocurrency-icons/master/128/icon/${symbol}.png`;
  }

}
