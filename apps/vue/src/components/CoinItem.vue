<template>
  <ion-item
    button
    color="primary"
    :detail="false"
    :routerLink="'/coins/' + coin.id"
  >
    <ion-avatar slot="start">
      <ion-img :src="coin.image" :alt="coin.name"></ion-img>
    </ion-avatar>
    <ion-label>
      <h2 class="bold">
        <ion-text color="light">
          {{ coin.name }}
        </ion-text>
      </h2>
    </ion-label>
    <div slot="end">
      <p class="bold">
        {{
          $formatNumber(coin.current_price, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 8,
          })
        }}
      </p>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonImg, IonAvatar, IonItem, IonText, IonLabel } from "@ionic/vue";
import { CoinModel } from "@/models/CoinModel";
import { PropType } from "vue";

export default {
  name: "CoinItem",
  components: {
    IonImg,
    IonAvatar,
    IonItem,
    IonText,
    IonLabel,
  },
  props: {
    coin: {
      type: Object as PropType<CoinModel>,
      required: true,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
ion-item {
  --background: transparent;
}

ion-avatar {
  min-width: 25px !important;
  min-height: 25px !important;
  background: white;
  padding: 2px;
}
</style>