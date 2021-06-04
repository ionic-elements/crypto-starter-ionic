import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinDetailPage } from './coin-detail';

const routes: Routes = [
  {
    path: '',
    component: CoinDetailPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoinDetailPageRoutingModule {}
