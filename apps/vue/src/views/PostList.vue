<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button
            :icon="chevronBack"
            default-href="/"
          ></ion-back-button>
        </ion-buttons>
        <ion-title> Crypto starter </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" :scrollEvents="true">
      <ion-refresher ref="ionRefresher" slot="fixed" @ionRefresh="onReload()">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <EmptyView
        v-if="viewState === ViewState.EMPTY"
        title="No posts found"
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
                style="width: 90%"
              ></ion-skeleton-text>
              <ion-skeleton-text
                animated
                style="width: 70%"
              ></ion-skeleton-text>
              <ion-skeleton-text
                animated
                style="width: 30%"
              ></ion-skeleton-text>
            </ion-label>
          </ion-item>
        </div>
      </div>

      <ion-list v-if="viewState === ViewState.CONTENT">
        <PostItem v-for="post in posts" :post="post" :key="post.id"></PostItem>
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
  IonBackButton,
  IonSkeletonText,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
} from "@ionic/vue";
import PostItem from "@/components/PostItem.vue";
import EmptyView from "@/components/EmptyView.vue";
import { defineComponent, ref } from "vue";
import { chevronBack, alertCircleOutline } from "ionicons/icons";
import PostService from "@/services/PostService";
import { PostModel } from "@/models/PostModel";
import { ViewState } from "@/enums/ViewState";

export default defineComponent({
  name: "PostList",

  setup() {
    const ionRefresher = ref();

    const viewState = ref<ViewState>(ViewState.INITIAL);
    const posts = ref<PostModel[]>([]);

    const onRefreshComplete = () => {
      ionRefresher.value.$el.complete();
    };

    const loadPosts = async () => {
      viewState.value = ViewState.LOADING;

      try {
        const {
          data: { Data },
        } = await PostService.load();
        posts.value = Data;

        if (posts.value.length) {
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
      loadPosts();
    };

    onIonViewDidEnter(() => {
      if (viewState.value !== ViewState.CONTENT) {
        loadPosts();
      }
    });

    return {
      viewState,
      ViewState,
      onReload,
      posts,
      ionRefresher,
      chevronBack,
      alertCircleOutline,
    };
  },
  components: {
    IonContent,
    IonHeader,
    IonList,
    IonItem,
    IonThumbnail,
    IonBackButton,
    IonButtons,
    IonSkeletonText,
    IonLabel,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    PostItem,
    EmptyView,
  },
});
</script>

<style lang="scss" scoped>
ion-list {
  background: transparent;
}

ion-item {
  p {
    color: var(--ion-color-medium-tint) !important;
  }
}
</style>