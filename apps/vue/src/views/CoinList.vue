<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar color="primary">
        <ion-title> Crypto starter </ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/posts">
            <ion-icon :icon="notificationsOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher ref="ionRefresher" slot="fixed" @ionRefresh="onReload()">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <EmptyView
        v-if="viewState === ViewState.EMPTY"
        title="No coins found"
        :icon="alertCircleOutline"
      ></EmptyView>
      <EmptyView
        v-if="viewState === ViewState.ERROR"
        title="Network error"
        :icon="alertCircleOutline"
      ></EmptyView>

      <div v-if="viewState === ViewState.LOADING">
        <div
          class="skeleton-wrapper"
          :key="item"
          v-for="item in [].constructor(20)"
        >
          <ion-item color="primary">
            <ion-thumbnail slot="start">
              <ion-skeleton-text
                animated
                style="width: 100%"
              ></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <ion-skeleton-text
                animated
                style="width: 40%"
              ></ion-skeleton-text>
            </ion-label>
            <div slot="end">
              <div style="width: 40px">
                <ion-skeleton-text
                  animated
                  style="width: 100%"
                ></ion-skeleton-text>
              </div>
            </div>
          </ion-item>
        </div>
      </div>

      <ion-list v-if="viewState === ViewState.CONTENT">
        <CoinItem v-for="coin in coins" :coin="coin" :key="coin.id"></CoinItem>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonList,
  IonItem,
  IonThumbnail,
  IonButtons,
  IonButton,
  IonIcon,
  IonSkeletonText,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
} from "@ionic/vue";
import CoinItem from "@/components/CoinItem.vue";
import EmptyView from "@/components/EmptyView.vue";
import { defineComponent, ref } from "vue";
import { notificationsOutline, alertCircleOutline } from "ionicons/icons";
import CoinService from "@/services/CoinService";
import { CoinModel } from "@/models/CoinModel";
import { ViewState } from "@/enums/ViewState";

export default defineComponent({
  name: "CoinList",

  setup() {
    const ionRefresher = ref();

    const viewState = ref<ViewState>(ViewState.INITIAL);
    const coins = ref<CoinModel[]>([]);

    const onRefreshComplete = () => {
      ionRefresher.value.$el.complete();
    };

    const loadCoins = async () => {
      viewState.value = ViewState.LOADING;

      try {
        const { data } = await CoinService.load();
        coins.value = data;

        if (coins.value.length) {
          viewState.value = ViewState.CONTENT;
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
      loadCoins();
    };

    onIonViewDidEnter(() => {
      if (viewState.value !== ViewState.CONTENT) {
        loadCoins();
      }
    });

    return {
      viewState,
      ViewState,
      onReload,
      coins,
      ionRefresher,
      notificationsOutline,
      alertCircleOutline,
    };
  },
  components: {
    IonContent,
    IonHeader,
    IonList,
    IonItem,
    IonThumbnail,
    IonButtons,
    IonButton,
    IonIcon,
    IonSkeletonText,
    IonLabel,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    CoinItem,
    EmptyView,
  },
});
</script>

<style scoped>
ion-list {
  background: transparent;
}
</style>