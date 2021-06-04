import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, useIonViewDidEnter, IonRefresher, IonRefresherContent, IonSpinner, IonCol, IonRow, IonText, IonBackButton } from '@ionic/react';
import { chevronBack } from 'ionicons/icons';
import React, { Reducer, useReducer, useRef } from "react";
import { ViewState } from "../enums/ViewState";
import { CoinModel } from "../models/CoinModel";
import CoinService from "../services/CoinService";
import EmptyView from '../components/EmptyView';
import { useParams } from 'react-router';
import { FormattedDate, useIntl } from 'react-intl';
import { FormattedNumber } from 'react-intl';
import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js';

interface StateProps {
  viewState: ViewState,
  coin: CoinModel | any,
}

const CoinDetailPage: React.FC<StateProps> = () => {

  const [state, setState] = useReducer<Reducer<StateProps, Partial<StateProps>>>(
    (state: StateProps, newState: Partial<StateProps>) => ({ ...state, ...newState }),
    { viewState: ViewState.INITIAL, coin: {} }
  );

  const { id } = useParams<{ id: string }>();
  const intl = useIntl();

  const ionRefresher = useRef<HTMLIonRefresherElement>(null);
  const canvas = useRef<any>(null);

  const onRefreshComplete = () => {
    ionRefresher.current!.complete();
  }

  const onReload = () => {
    setState({
      viewState: ViewState.LOADING,
    })
    loadCoin();
  }

  const buildChart = (chartData: any) => {

    Chart.register(
      CategoryScale,
      LinearScale,
      LineController,
      PointElement,
      LineElement,
      Tooltip,
    );

    const context = canvas.current!.getContext('2d');

    const labels = chartData.prices
      .map((a: any) => intl.formatDate(a[0], {
        month: 'short',
        day: '2-digit',
        year: '2-digit',
      }));

    const coinHistory = chartData.prices
      .map((a: any) => a[1]);

    return new Chart(context, {
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
              label: (tooltipItems: any) => {
                const price = tooltipItems.raw as number;
                return intl.formatNumber(price, {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 8
                });
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

  const loadCoin = async () => {

    try {

      const [chartResponse, coinResponse] = await Promise.all([
        CoinService.getChart(id),
        CoinService.loadOne(id),
      ]);

      const coin = coinResponse.data[id];
      coin.name = id;

      setState({
        coin: coin,
        viewState: coin ? ViewState.CONTENT : ViewState.EMPTY,
      });

      if (coin) {
        setTimeout(() => buildChart(chartResponse.data), 300);
      }

      onRefreshComplete();

    } catch {

      setState({
        viewState: ViewState.ERROR,
      });

      onRefreshComplete();
    }
  }

  useIonViewDidEnter(() => {

    if (state.viewState !== ViewState.CONTENT) {
      setState({
        viewState: ViewState.LOADING,
      });
      loadCoin();
    }

  }, [state.viewState, id]);

  return (
    <IonPage>
      <IonHeader class="ion-no-border" translucent={true}>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" icon={chevronBack}></IonBackButton>
          </IonButtons>
          {state.viewState === ViewState.CONTENT &&
            <IonTitle>{state.coin.name}</IonTitle>
          }
        </IonToolbar>
      </IonHeader >
      <IonContent fullscreen={true} class="ion-padding">
        <IonRefresher ref={ionRefresher} slot="fixed" onIonRefresh={() => onReload()}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {state.viewState === ViewState.EMPTY &&
          <EmptyView title="Coin not found" />
        }

        {state.viewState === ViewState.ERROR &&
          <EmptyView title="Network error" />
        }

        {state.viewState === ViewState.LOADING &&
          <div className="flex align-items-center justify-content-center full-height">
            <IonSpinner></IonSpinner>
          </div>
        }

        {state.viewState === ViewState.CONTENT &&

          <IonRow>
            <IonCol size-xs="12" size-md="6">
              <h5 className="bold ion-text-uppercase ion-margin-bottom">Price (30 Days)</h5>
              <canvas ref={canvas} />
            </IonCol>
            <IonCol size-xs="12" size-md="6">
              <IonRow>
                <IonCol size="4" class="ion-text-center">
                  <IonText color="medium">
                    <p className="ion-text-uppercase bold">Price</p>
                  </IonText>
                  <p className="ion-no-margin bold">
                    <FormattedNumber value={state.coin.usd} style="currency" currency="USD" maximumFractionDigits={8} />
                  </p>
                </IonCol>
                <IonCol size="4" class="ion-text-center">
                  <IonText color="medium">
                    <p className="ion-text-uppercase bold">Change 24h</p>
                  </IonText>
                  <p className="ion-no-margin bold">
                    <FormattedNumber value={state.coin.usd_24h_change / 100} style="percent" signDisplay="always" minimumFractionDigits={2} maximumFractionDigits={2} />
                  </p>
                </IonCol>
                <IonCol size="4" class="ion-text-center">
                  <IonText color="medium">
                    <p className="ion-text-uppercase bold">Volume 24h</p>
                  </IonText>
                  <p className="ion-no-margin bold">
                    <FormattedNumber value={state.coin.usd_24h_vol} style="currency" currency="USD" notation="compact" />
                  </p>
                </IonCol>
              </IonRow>

              <IonRow class="ion-margin-vertical">
                <IonCol class="ion-text-center">
                  <IonText color="medium">
                    <p className="ion-text-uppercase bold">Market cap</p>
                  </IonText>
                  <p className="ion-no-margin bold">
                    <FormattedNumber value={state.coin.usd_market_cap} style="currency" currency="USD" notation="compact" />
                  </p>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol class="ion-text-center">
                  <IonText color="medium">
                    <p className="ion-text-uppercase bold">Last updated</p>
                  </IonText>
                  <p className="ion-no-margin bold">
                    <FormattedDate value={new Date(state.coin.last_updated_at * 1000)} year="numeric" month="short" day="numeric" hour="numeric" minute="2-digit" />
                  </p>
                </IonCol>
              </IonRow>

            </IonCol>
          </IonRow>

        }
      </IonContent>
    </IonPage>
  )
}

export default CoinDetailPage;