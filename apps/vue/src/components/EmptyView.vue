<template>
  <div class="container">
    <ion-icon :icon="icon" color="light"></ion-icon>
    <h5 v-html="title"></h5>
    <p v-html="text"></p>
  </div>
</template>

<script lang="ts">
import { IonIcon } from "@ionic/vue";

export default {
  name: "EmptyView",
  components: {
    IonIcon,
  },
  props: {
    icon: String,
    title: String,
    text: String,
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;

  h5 {
    font-size: 24px;
    font-weight: bold;
  }

  p {
    font-size: 11px;
    font-weight: bold;
    opacity: 0.3;
    margin: 0;
  }

  ion-icon {
    font-size: 60px;
  }
}
</style>