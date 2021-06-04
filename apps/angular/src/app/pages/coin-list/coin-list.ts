import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { BasePage } from 'src/app/base-page';
import { IonContent } from '@ionic/angular';
import { CoinService } from 'src/app/providers/coin-service/coin-service';
import { CoinModel } from 'src/app/models/coin-model';

@Component({
  selector: 'app-coin-list',
  templateUrl: 'coin-list.html',
  styleUrls: ['./coin-list.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('50ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class CoinListPage extends BasePage implements OnInit {

  @ViewChild(IonContent, { static: true }) ionContent: IonContent;

  public coins: CoinModel[] = [];

  constructor(injector: Injector, private coinService: CoinService) {
    super(injector);
  }

  ngOnInit() {}

  ionViewDidEnter() {

    if (this.viewState !== this.ViewState.CONTENT) {
      this.showLoadingView({ showOverlay: false });
      this.loadData();
    }
  }

  async loadData() {

    try {
      const data = await this.coinService.load();
      this.coins = data;
      
      if (this.coins?.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete();

    } catch {
      this.onRefreshComplete();
      this.showErrorView();
    }
  }

  onReload(event: any = {}) {
    this.refresher = event.target;
    this.showLoadingView({ showOverlay: false });
    this.loadData();
  }

}
