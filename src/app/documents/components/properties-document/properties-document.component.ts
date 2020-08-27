import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-properties-document',
  templateUrl: './properties-document.component.html',
  styleUrls: ['./properties-document.component.scss']
})
export class PropertiesDocumentComponent implements OnInit {
  public colsMembers: any[];
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

  constructor() { }

  ngOnInit(): void {
    this.colsMembers  = [
      { field: 'name', header: 'account.name' },
      { field: 'email', header: 'account.email' }
    ];
  }

}
