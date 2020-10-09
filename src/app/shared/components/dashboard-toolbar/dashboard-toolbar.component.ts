import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
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
  @Output() changeSearch: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  onClickToolbarButton(itemId: number | string) {
    this.toolbarButtonClickEmitter.emit(itemId);
  }

  emitSearchDocument(value: string) {
    this.changeSearch.emit(value);
  }

}
