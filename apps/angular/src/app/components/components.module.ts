import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CoinComponent } from './coin/coin';
import { NgxIntlModule } from 'ngx-intl';

@NgModule({
	declarations: [
		CoinComponent,
	],
	entryComponents: [
		CoinComponent
	],
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
    NgxIntlModule,
	],
	exports: [
		CoinComponent,
	]
})
export class ComponentsModule {}

