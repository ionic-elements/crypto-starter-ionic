import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CoinDetailPage } from './coin-detail';

import { CoinDetailPageRoutingModule } from './coin-detail-routing.module';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoinDetailPageRoutingModule,
    SharedModule,
  ],
  declarations: [CoinDetailPage]
})
export class CoinDetailPageModule {}
