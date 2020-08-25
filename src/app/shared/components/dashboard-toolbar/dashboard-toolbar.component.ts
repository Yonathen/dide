import { Component, OnInit, Input } from '@angular/core';
import { LoideMenuItem } from '../../model/menu-item';
import { LoideToolbarMenu } from '../../model/toolbar-menu';


@Component({
  selector: 'app-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.scss']
})
export class DashboardToolbarComponent implements OnInit {

  @Input() toolbar: LoideToolbarMenu;

  constructor() { }

  ngOnInit(): void {
  }

}
