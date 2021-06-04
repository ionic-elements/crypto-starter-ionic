<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/"
            :icon="chevronBack"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>{{ coin?.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher ref="ionRefresher" slot="fixed" @ionRefresh="onReload()">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div
        class="flex align-items-center justify-content-center full-height"
        v-if="viewState === ViewState.LOADING"
      >
        <ion-spinner></ion-spinner>
      </div>

      <EmptyView
        v-if="viewState === ViewState.EMPTY"
        title="Coin not found"
        :icon="alertCircleOutline"
      ></EmptyView>
      <EmptyView
        v-if="viewState === ViewState.ERROR"
        title="Network error"
        :icon="alertCircleOutline"
      ></EmptyView>

      <ion-row v-if="viewState === ViewState.CONTENT">
        <ion-col size-xs="12" size-md="6">
          <h5 class="bold ion-text-uppercase ion-margin-bottom">
            Price (30 Days)
          </h5>
          <canvas ref="canvasRef" />
        </ion-col>
        <ion-col size-xs="12" size-md="6">
          <ion-row>
            <ion-col size="4" class="ion-text-center">
              <ion-text color="medium">
                <p class="ion-text-uppercase bold text-medium">Price</p>
              </ion-text>
              <p class="ion-no-margin text-medium bold">
                {{
                  $formatNumber(coin?.usd, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 8,
                  })
                }}
              </p>
            </ion-col>
            <ion-col size="4" class="ion-text-center">
              <ion-text color="medium">
                <p class="ion-text-uppercase bold text-medium">Change 24h</p>
              </ion-text>
              <p class="ion-no-margin text-medium bold">
                {{
                  $formatNumber(coin?.usd_24h_change / 100, {
                    style: "percent",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    signDisplay: "always",
                  })
                }}
              </p>
            </ion-col>
            <ion-col size="4" class="ion-text-center">
              <ion-text color="medium">
                <p class="ion-text-uppercase bold text-medium">Volume 24h</p>
              </ion-text>
              <p class="ion-no-margin text-medium bold">
                {{
                  $formatNumber(coin?.usd_24h_vol, {
                    style: "currency",
                    currency: "USD",
                    notation: "compact",
                  })
                }}
              </p>
            </ion-col>
          </ion-row>

          <ion-row class="ion-margin-vertical">
            <ion-col class="ion-text-center">
              <ion-text color="medium">
                <p class="ion-text-uppercase bold text-medium">Market cap</p>
              </ion-text>
              <p class="ion-no-margin text-medium bold">
                {{
                  $formatNumber(coin?.usd_market_cap, {
                    style: "currency",
                    currency: "USD",
                    notation: "compact",
                  })
                }}
              </p>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col class="ion-text-center">
              <ion-text color="medium">
                <p class="ion-text-uppercase bold text-medium">Last updated</p>
              </ion-text>
              <p class="ion-no-margin text-medium bold">
                {{
                  $formatDate(coin?.last_updated_at * 1000, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                }}
              </p>
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { ref } from "vue";
import {
  IonContent,
  IonHeader,
  IonButtons,
  IonBackButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonText,
  IonToolbar,
  IonRow,
  IonCol,
  onIonViewDidEnter,
} from "@ionic/vue";
import { chevronBack, alertCircleOutline } from "ionicons/icons";
import EmptyView from "@/components/EmptyView.vue";
import { ViewState } from "@/enums/ViewState";
import { CoinModel } from "@/models/CoinModel";
import CoinService from "@/services/CoinService";
import { useRoute } from "vue-router";
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useIntl } from "vue-intl";

export default {
  name: "CoinDetail",
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonButtons,
    IonBackButton,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    IonRow,
    IonCol,
    IonText,
    IonSpinner,
    EmptyView,
  },
  setup() {
    const ionRefresher = ref();
    const canvasRef = ref();

    const viewState = ref<ViewState>(ViewState.INITIAL);
    const coin = ref<CoinModel>();
    const route = useRoute();
    const intl = useIntl();

    const onRefreshComplete = () => {
      ionRefresher.value.$el.complete();
    };

    const buildChart = (chartData: any) => {
      Chart.register(
        CategoryScale,
        LinearScale,
        LineController,
        PointElement,
        LineElement,
        Tooltip
      );

      const context = canvasRef.value.getContext("2d");

      const labels = chartData.prices.map((a: number[]) =>
        intl.formatDate(a[0], {
          dateStyle: "medium",
        })
      );
      const coinHistory = chartData.prices.map((a: number[]) => a[1]);

      return new Chart(context, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              data: coinHistory,
              borderColor: "#f8f8f8",
              fill: false,
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItems: any) => {
                  const price = tooltipItems.raw as number;
                  return intl.formatNumber(price, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 8,
                  });
                },
              },
            },
          },
          responsive: true,
          scales: {
            xAxes: {
              display: false,
            },
            yAxes: {
              display: false,
            },
          },
        },
      });
    };

    const loadCoin = async () => {
      viewState.value = ViewState.LOADING;

      try {
        const id = route.params.id as string;
        const [chartResponse, coinResponse] = await Promise.all([
          CoinService.getChart(id),
          CoinService.loadOne(id),
        ]);

        const coinData = coinResponse.data[id];
        coinData.name = id;
        coin.value = coinData;

        if (coin.value) {
          viewState.value = ViewState.CONTENT;
          setTimeout(() => buildChart(chartResponse.data), 300);
        } else {
          viewState.value = ViewState.EMPTY;
        }

      } catch {
        viewState.value = ViewState.ERROR;
      } finally {
        onRefreshComplete();
      }
    };

    const onReload = () => {
      loadCoin();
    };

    onIonViewDidEnter(() => {
      if (viewState.value !== ViewState.CONTENT) {
        loadCoin();
      }
    });

    return {
      viewState,
      ViewState,
      onReload,
      coin,
      ionRefresher,
      canvasRef,
      chevronBack,
      alertCircleOutline,
    };
  },
};
</script>

<style lang="sass">
</style>