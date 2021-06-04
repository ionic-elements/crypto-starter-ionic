import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinListPage } from './coin-list';

const routes: Routes = [
  {
    path: '',
    component: CoinListPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoinListPageRoutingModule {}
