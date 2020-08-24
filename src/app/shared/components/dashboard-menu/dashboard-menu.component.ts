import { Component, OnInit, Input } from '@angular/core';
import { LoideMenuItem } from '../../model/menu-item';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss']
})
export class DashboardMenuComponent implements OnInit {

  @Input() menuItems: LoideMenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
