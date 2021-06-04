import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { BasePage } from 'src/app/base-page';
import { PostModel } from 'src/app/models/post-model';
import { PostService } from 'src/app/providers/post-service/post-service';
import { IonContent } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.html',
  styleUrls: ['./post-list.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('100ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class PostListPage extends BasePage implements OnInit {

  @ViewChild(IonContent, { static: true }) ionContent: IonContent;

  public posts: PostModel[] = [];

  constructor(injector: Injector,
    private postService: PostService) {
    super(injector);
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.showLoadingView({ showOverlay: false });
    this.loadData();
  }

  async loadData() {

    try {
      const { Data } = await this.postService.load();
      this.posts = Data;

      if (this.posts?.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete();

    } catch {
      this.onRefreshComplete();
      this.showErrorView();
    }
  }

  async openUrl(url: string) {
    Browser.open({
      url: url,
      windowName: "_target",
      toolbarColor: "#29323c",
    });
  }

  onReload(event: any = {}) {
    this.refresher = event.target;
    this.loadData();
  }

}
