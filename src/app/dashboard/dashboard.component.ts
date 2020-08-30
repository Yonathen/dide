import { DashboardState } from './../navigation.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public state: DashboardState;

  constructor() { }

  ngOnInit(): void {
    this.state = history.state.data;
  }

}
