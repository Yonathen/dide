import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoideMenuItem } from '../../model/menu-item';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss']
})
export class DashboardMenuComponent implements OnInit {

  @Input() menuItems: LoideMenuItem[] = [];
  @Output('onItemClick') itemClickEmitter: EventEmitter<string | number> = new EventEmitter<string | number>();

  constructor() { }

  ngOnInit(): void {
  }

  onItemClick(item: LoideMenuItem) {
    this.itemClickEmitter.emit(item.id);
  }

}
