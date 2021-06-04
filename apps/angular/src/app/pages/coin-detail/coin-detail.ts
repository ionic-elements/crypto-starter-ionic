import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js';
import { BasePage } from 'src/app/base-page';
import { CoinModel } from 'src/app/models/coin-model';
import { CoinService } from 'src/app/providers/coin-service/coin-service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.html',
  styleUrls: ['./coin-detail.scss'],
  providers: [CurrencyPipe, DatePipe],
})
export class CoinDetailPage extends BasePage implements OnInit {

  public coin: CoinModel;
  public chart: Chart;

  public formatDateOpts: any = {
    dateStyle: 'medium',
    timeStyle: 'short',
  };

  public formatNumberCompact: any = {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
  };

  public formatNumberPercent: any = {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always'
  };

  constructor(injector: Injector,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private coinService: CoinService) {
    super(injector);
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.loadData();
  }

  async loadData(event: any = {}) {

    this.showLoadingView({ showOverlay: false });
    this.refresher = event.target;

    try {
      const id = this.getParams().id;
      const [chartData, coin] = await Promise.all([
        this.coinService.getChart(id),
        this.coinService.loadOne(id),
      ]);
      this.coin = coin[id];
      this.coin.name = id;

      if (this.coin) {
        this.showContentView();
        setTimeout(() => this.chart = this.buildChart(chartData), 300);
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete();

    } catch {
      this.onRefreshComplete();
      this.showErrorView();
    }
  }

  buildChart(chartData: any) {

    Chart.register(
      CategoryScale,
      LinearScale,
      LineController,
      PointElement,
      LineElement,
      Tooltip,
    );

    const labels = chartData.prices
      .map((a: any) => this.datePipe.transform(a[0]), 'MMM, d');

    const coinHistory = chartData.prices
      .map((a: any) => a[1]);

    return new Chart('canvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: coinHistory,
          borderColor: '#f8f8f8',
          fill: false
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItems) => {
                const price = tooltipItems.raw as number;
                return this.currencyPipe.transform(price, 'USD', 'symbol', '0.2-8');
              }
            }
          },
        },
        responsive: true,
        scales: {
          xAxes: {
            display: false
          },
          yAxes: {
            display: false
          }
        }
      }
    });
  }

}
