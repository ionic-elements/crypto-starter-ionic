import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'coins',
    loadChildren: () => import('./pages/coin-list/coin-list.module').then(m => m.CoinListPageModule)
  },
  {
    path: 'coins/:id',
    loadChildren: () => import('./pages/coin-detail/coin-detail.module').then(m => m.CoinDetailPageModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./pages/post-list/post-list.module').then(m => m.PostListPageModule)
  },
  {
    path: '',
    redirectTo: 'coins',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
