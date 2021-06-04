import { Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {
  LoadingController, ToastController,
  AlertController, IonInfiniteScroll, IonRefresher, NavController, MenuController
} from '@ionic/angular';
import { ViewState } from './enums/ViewState';

export abstract class BasePage {

  public ViewState = ViewState;
  public viewState: ViewState;

  protected refresher: IonRefresher;
  protected infiniteScroll: IonInfiniteScroll;
  protected navParams: ActivatedRoute;
  protected router: Router;

  private loader: any;
  private navCtrl: NavController;
  private toastCtrl: ToastController;
  private loadingCtrl: LoadingController;
  protected alertCtrl: AlertController;
  protected menuCtrl: MenuController;

  protected activatedRoute: ActivatedRoute;
  private title: Title;

  constructor(injector: Injector) {

    this.loadingCtrl = injector.get(LoadingController);
    this.toastCtrl = injector.get(ToastController);
    this.alertCtrl = injector.get(AlertController);
    this.navCtrl = injector.get(NavController);
    this.navParams = injector.get(ActivatedRoute);
    this.menuCtrl = injector.get(MenuController);
    this.router = injector.get(Router);
    this.activatedRoute = injector.get(ActivatedRoute);
    this.title = injector.get(Title);
  }

  public setPageTitle(title: string): void {
    this.title.setTitle(title);
  }

  async showLoadingView(params: { showOverlay: boolean }) {

    if (params.showOverlay) {

      this.loader = await this.loadingCtrl.create({
        message: 'Loading...'
      });

      return await this.loader.present();
    } else {
      this.viewState = ViewState.LOADING;
    }

    return true;

  }

  async dismissLoadingView() {

    if (!this.loader) return;

    try {
      await this.loader.dismiss();
    } catch (error) {
      console.log('ERROR: LoadingController dismiss', error);
    }
  }

  showContentView() {
    this.viewState = ViewState.CONTENT;
    this.dismissLoadingView();
  }

  showEmptyView() {
    this.viewState = ViewState.EMPTY;
    this.dismissLoadingView();
  }

  showErrorView() {
    this.viewState = ViewState.ERROR;
    this.dismissLoadingView();
  }

  onRefreshComplete(data = null) {

    if (this.refresher) {
      this.refresher.disabled = true;
      this.refresher.complete();
      setTimeout(() => {
        this.refresher.disabled = false;
      }, 100);
    }

    if (this.infiniteScroll) {
      this.infiniteScroll.complete();

      if (data && data.length === 0) {
        this.infiniteScroll.disabled = true;
      } else {
        this.infiniteScroll.disabled = false;
      }
    }
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      color: 'secondary',
      position: 'bottom',
      duration: 3000
    });

    return await toast.present();
  }

  async showAlert(message: string) {

    const alert = await this.alertCtrl.create({
      header: '',
      message: message,
      buttons: [{
        text: 'Ok',
        role: ''
      }]
    });

    return await alert.present();
  }

  showConfirm(message: string): Promise<boolean> {

    return new Promise(async (resolve) => {

      const confirm = await this.alertCtrl.create({
        header: '',
        message: message,
        buttons: [{
          text: 'cancel',
          role: 'cancel',
          handler: () => resolve(false)
        }, {
          text: 'Ok',
          handler: () => resolve(true)
        }]
      });

      confirm.present();

    });

  }

  navigateTo(page: any, queryParams: any = {}) {
    return this.router.navigate([page], {
      queryParams: queryParams
    });
  }

  navigateToRelative(page: any, queryParams: any = {}) {
    return this.router.navigate([page], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute
    });
  }

  goBack(): void {
    this.navCtrl.back();
  }

  setRelativeRoot(page: string, queryParams: any = {}) {
    this.navCtrl.setDirection('root', false);
    return this.router.navigate([page], {
      queryParams: queryParams,
      relativeTo: this.activatedRoute
    });
  }

  setRoot(url: string) {
    return this.navCtrl.navigateRoot(url, {
      animated: true,
      animationDirection: 'forward',
    });
  }

  getRouterParams() {
    return this.activatedRoute.snapshot.data;
  }

  getParams() {
    return this.activatedRoute.snapshot.params;
  }

  getQueryParams() {
    return this.activatedRoute.snapshot.queryParams;
  }

}
