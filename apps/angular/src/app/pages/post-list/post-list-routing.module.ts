import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListPage } from './post-list';

const routes: Routes = [
  {
    path: '',
    component: PostListPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostListPageRoutingModule {}
