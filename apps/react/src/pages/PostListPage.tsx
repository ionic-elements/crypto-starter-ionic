import React, { Reducer, useReducer, useRef } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonList, useIonViewDidEnter, IonRefresher, IonRefresherContent, IonSkeletonText, IonItem, IonThumbnail, IonLabel, IonBackButton } from '@ionic/react';
import PostService from '../services/PostService';
import PostItem from '../components/PostItem';
import EmptyView from '../components/EmptyView';
import './PostListPage.scss';
import { PostModel } from '../models/PostModel';
import { chevronBack } from 'ionicons/icons';
import { ViewState } from '../enums/ViewState';

interface PostListPageState {
  viewState: ViewState;
  posts: PostModel[];
}

const PostListPage: React.FC<PostListPageState> = () => {

  const [state, setState] = useReducer<Reducer<PostListPageState, Partial<PostListPageState>>>(
    (state: PostListPageState, newState: Partial<PostListPageState>) => ({ ...state, ...newState }),
    { viewState: ViewState.INITIAL, posts: [] }
  );

  // Fake items for the skeleton items
  const fakeArray: number[] = Array.from(Array(16).keys());

  const ionRefresher = useRef<HTMLIonRefresherElement>(null);

  const onRefreshComplete = () => {
    ionRefresher.current!.complete();
  }

  const loadPosts = async () => {

    try {
      const { data: { Data: posts } } = await PostService.load();

      setState({
        posts: posts,
        viewState: posts.length ? ViewState.CONTENT : ViewState.EMPTY,
      });

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
      loadPosts();
    }

  }, [state.viewState]);

  return (
    <IonPage id="post-list">
      <IonHeader class="ion-no-border" translucent={true}>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" icon={chevronBack}></IonBackButton>
          </IonButtons>
          <IonTitle>Crypto starter</IonTitle>
        </IonToolbar>
      </IonHeader >

      <IonContent fullscreen={true}>

        <IonRefresher ref={ionRefresher} slot="fixed" onIonRefresh={() => loadPosts()}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {state.viewState === ViewState.EMPTY &&
          <EmptyView title="No posts found" />
        }

        {state.viewState === ViewState.ERROR &&
          <EmptyView title="Network error" />
        }

        {state.viewState === ViewState.LOADING &&
          <div>

            {fakeArray.map((item: number, index: number) => {
              return (
                <IonItem key={index} color="primary">
                  <IonThumbnail slot="start">
                    <IonSkeletonText animated style={{ width: '100%' }}></IonSkeletonText>
                  </IonThumbnail>
                  <IonLabel>
                    <IonSkeletonText animated style={{ width: '90%' }}></IonSkeletonText>
                    <IonSkeletonText animated style={{ width: '70%' }}></IonSkeletonText>
                    <IonSkeletonText animated style={{ width: '30%' }}></IonSkeletonText>
                  </IonLabel>
                </IonItem>
              )
            })}

          </div>
        }

        {state.viewState === ViewState.CONTENT &&
          <IonList>
            {state.posts.map(post => {
              return (
                <PostItem key={post.id} title={post.title} image={post.imageurl} source={post.source_info.name} published={post.published_on} url={post.url} ></PostItem>
              )
            })}
          </IonList>
        }
      </IonContent>
    </IonPage >
  );
};

export default PostListPage;