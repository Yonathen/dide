import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LoideMenuItem } from '../../model/menu-item';
import { LoideToolbarMenu } from '../../model/toolbar-menu';


@Component({
  selector: 'app-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.scss']
})
export class DashboardToolbarComponent implements OnInit {

  @Input() toolbar: LoideToolbarMenu;

  @Output('onClickToolbarButton') toolbarButtonClickEmitter: EventEmitter< number | string> = new EventEmitter< number | string>();

  constructor() { }

  ngOnInit(): void {
  }

  onClickToolbarButton(itemId: number | string) {
    this.toolbarButtonClickEmitter.emit(itemId);
  }

}
