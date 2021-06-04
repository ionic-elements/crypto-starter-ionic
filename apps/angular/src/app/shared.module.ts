import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { IonicModule } from '@ionic/angular';
import { EmptyViewModule } from './components/empty-view/empty-view.module';
import { ComponentsModule } from './components/components.module';
import { NgxIntlModule } from 'ngx-intl';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    IonicModule,
    EmptyViewModule,
    ComponentsModule,
    NgxIntlModule,
  ],
  exports: [
    CommonModule,
    IonicModule,
    EmptyViewModule,
    ComponentsModule,
    NgxIntlModule,
  ],
  providers: [],
})
export class SharedModule {}
