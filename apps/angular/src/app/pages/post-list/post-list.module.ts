import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PostListPage } from './post-list';

import { PostListPageRoutingModule } from './post-list-routing.module';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostListPageRoutingModule,
    SharedModule,
  ],
  declarations: [PostListPage]
})
export class PostListPageModule {}

