import React, { Reducer, useReducer, useRef } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonList, useIonViewDidEnter, IonRefresher, IonRefresherContent, IonSkeletonText, IonItem, IonThumbnail, IonLabel, IonButton, IonIcon, IonAvatar } from '@ionic/react';
import CoinItem from '../components/CoinItem';
import { CoinModel } from '../models/CoinModel';
import CoinService from '../services/CoinService';
import EmptyView from '../components/EmptyView';
import './CoinListPage.scss';
import { notificationsOutline } from 'ionicons/icons';
import { ViewState } from '../enums/ViewState';

interface CoinListPageState {
  viewState: ViewState,
  coins: CoinModel[],
}

const CoinListPage: React.FC<CoinListPageState> = () => {

  const [state, setState] = useReducer<Reducer<CoinListPageState, Partial<CoinListPageState>>>(
    (state: CoinListPageState, newState: Partial<CoinListPageState>) => ({ ...state, ...newState }),
    { viewState: ViewState.INITIAL, coins: [] }
  );

  // Fake items for the skeleton items
  const fakeArray: number[] = Array.from(Array(16).keys());

  const ionRefresher = useRef<HTMLIonRefresherElement>(null);

  const onRefreshComplete = () => {
    ionRefresher.current!.complete();
  }

  const loadCoins = async () => {

    try {
      const { data: coins } = await CoinService.load();

      setState({
        coins: coins,
        viewState: coins.length ? ViewState.CONTENT : ViewState.EMPTY,
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
      loadCoins();
    }

  }, [state.viewState]);

  return (
    <IonPage id="coin-list">
      <IonHeader class="ion-no-border" translucent={true}>
        <IonToolbar color="primary">
          <IonTitle>Crypto starter</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/posts">
              <IonIcon icon={notificationsOutline} slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader >

      <IonContent fullscreen={true}>

        <IonRefresher ref={ionRefresher} slot="fixed" onIonRefresh={() => loadCoins()}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {state.viewState === ViewState.EMPTY &&
          <EmptyView title="No coins found" />
        }

        {state.viewState === ViewState.ERROR &&
          <EmptyView title="Network error" />
        }

        {state.viewState === ViewState.LOADING &&
          <div>

            {fakeArray.map((item: number, index: number) => {
              return (
                <IonItem key={index} color="primary">
                  <IonAvatar slot="start">
                    <IonSkeletonText animated style={{ width: '100%' }}></IonSkeletonText>
                  </IonAvatar>
                  <IonLabel>
                    <IonSkeletonText animated style={{ width: '40%' }}></IonSkeletonText>
                  </IonLabel>
                  <div slot="end">
                    <div style={{ width: '40px' }}>
                      <IonSkeletonText animated style={{ width: '100%' }}></IonSkeletonText>
                    </div>
                  </div>
                </IonItem>
              )
            })}

          </div>
        }

        {state.viewState === ViewState.CONTENT &&
          <IonList>
            {state.coins.map(coin => {
              return (
                <CoinItem key={coin.id} id={coin.id} name={coin.name} image={coin.image} price={coin.current_price}></CoinItem>
              )
            })}
          </IonList>
        }
      </IonContent>
    </IonPage >
  );
};

export default CoinListPage;