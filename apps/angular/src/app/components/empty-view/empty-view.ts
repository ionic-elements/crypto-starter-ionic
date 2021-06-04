import { Component, Input } from '@angular/core';

@Component({
  selector: 'empty-view',
  templateUrl: './empty-view.html',
  styleUrls: ['./empty-view.scss'],
})
export class EmptyView {

  @Input() title: string = '';
  @Input() text: string = '';
  @Input() icon: string = 'alert-circle-outline';

  constructor() {}

}
