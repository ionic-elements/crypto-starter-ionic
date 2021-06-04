import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EmptyView } from './empty-view';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    EmptyView,
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    EmptyView
  ]
})
export class EmptyViewModule {}
