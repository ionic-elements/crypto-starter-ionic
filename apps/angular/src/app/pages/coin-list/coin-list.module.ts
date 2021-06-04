import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CoinListPage } from './coin-list';

import { CoinListPageRoutingModule } from './coin-list-routing.module';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoinListPageRoutingModule,
    SharedModule,
  ],
  declarations: [CoinListPage]
})
export class CoinListPageModule {}
