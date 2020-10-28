import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DideMenuItem } from '../../model/menu-item';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss']
})
export class DashboardMenuComponent implements OnInit {

  @Input() isLogged: boolean = false;
  @Input() menuItems: DideMenuItem[] = [];
  @Output('onItemClick') itemClickEmitter: EventEmitter<string | number> = new EventEmitter<string | number>();

  constructor() { }

  ngOnInit(): void {
  }

  onItemClick(item: DideMenuItem) {
    this.itemClickEmitter.emit(item.id);
  }

}
