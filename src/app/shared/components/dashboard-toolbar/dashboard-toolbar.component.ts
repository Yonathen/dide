import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { DideMenuItem } from '../../model/menu-item';
import { DideToolbarMenu } from '../../model/toolbar-menu';
import { util } from 'api/server/lib/util';


@Component({
  selector: 'app-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.scss']
})
export class DashboardToolbarComponent implements OnInit {
  @Input() isLogged: boolean = false;
  @Input() toolbar: DideToolbarMenu;
  sortAsc: boolean = false;

  @Output('onClickToolbarButton') toolbarButtonClickEmitter: EventEmitter< number | string> = new EventEmitter< number | string>();
  @Output() changeSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeSort: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('searchInput') searchInput: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  get userLogged(): boolean {
    return this.isLogged || util.valueExist(Meteor.userId());
  }

  onClickToolbarButton(itemId: number | string) {
    this.toolbarButtonClickEmitter.emit(itemId);
  }

  emitSearchDocument(value: string) {
    this.changeSearch.emit(value);
  }

  emitSortDocument() {
    this.sortAsc = !this.sortAsc;
    this.changeSort.emit(this.sortAsc);
  }

}
