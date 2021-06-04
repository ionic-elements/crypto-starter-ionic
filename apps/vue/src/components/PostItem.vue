<template>
  <ion-item button :detail="false" color="primary" @click="openUrl(post.url)">
    <ion-thumbnail slot="start">
      <ion-img :src="post.imageurl" :alt="post.title"></ion-img>
    </ion-thumbnail>
    <ion-label class="ion-text-wrap">
      <h2 class="bold line-clamp-2">{{ post.title }}</h2>
      <p class="bold text-md mt-xs">
        {{ post.source_info.name }} |
        {{
          $formatDate(post.published_on * 1000, {
            month: "short",
            day: "numeric",
            year: "2-digit",
            hour: "numeric",
            minute: "2-digit",
          })
        }}
      </p>
    </ion-label>
  </ion-item>
</template>

<script lang="ts">
import { IonImg, IonThumbnail, IonItem, IonLabel } from "@ionic/vue";
import { Browser } from "@capacitor/browser";
import { PropType } from "vue";
import { PostModel } from "@/models/PostModel";

export default {
  name: "PostItem",
  components: {
    IonImg,
    IonThumbnail,
    IonItem,
    IonLabel,
  },
  props: {
    post: {
      type: Object as PropType<PostModel>,
      required: true,
    },
  },
  setup() {
    const openUrl = (url: string) => {
      Browser.open({
        url: url,
        windowName: "_target",
        toolbarColor: "#29323c",
      });
    };

    return { openUrl };
  },
};
</script>

<style lang="scss" scoped>
ion-item {
  p {
    color: var(--ion-color-medium-tint) !important;
  }
}
</style>
