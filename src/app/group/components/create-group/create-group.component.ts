import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  public cols: any[];
  public members: any = [
    {name: 'Jhon Doe', email: 'jhon@gmail.com'},
    {name: 'Jhon Doe', email: 'jhon@gmail.com'},
    {name: 'Jhon Doe', email: 'jhon@gmail.com'},
    {name: 'Jhon Doe', email: 'jhon@gmail.com'},
    {name: 'Jhon Doe', email: 'jhon@gmail.com'},
    {name: 'Jhon Doe', email: 'jhon@gmail.com'},
    {name: 'Jhon Doe', email: 'jhon@gmail.com'},
    {name: 'Jhon Doe', email: 'jhon@gmail.com'}
  ]

  constructor(public translateService: TranslateService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'account.name' },
      { field: 'email', header: 'account.email' }
    ];
  }

}
