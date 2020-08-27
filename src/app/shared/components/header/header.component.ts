import { Component, OnInit, Input } from '@angular/core';

import { LoideRoute } from '../../enums/loide-route';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() route: string;
  notifySidebar: boolean;

  public createAccountDialog: boolean;
  public accessAccountDialog: boolean;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  get isEditor(): boolean {
    return this.route === LoideRoute.Editor;
  }

  get isLogedIn(): boolean {
    return false; 
  }

  goToDashboard() {
    this.router.navigate( [LoideRoute.Documents]);
  }


  openCreateAccountDialog() {
    this.createAccountDialog = true;
  }

  openAccessAccountDialog() {
    this.accessAccountDialog = true;
  }

}
