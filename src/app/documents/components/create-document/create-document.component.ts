import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.scss']
})
export class CreateDocumentComponent implements OnInit {
  public cols: any[];
  public folderTableValues: any = [
    {name: 'Sample folder', dateCreated: 'August 27, 2020 13:52', dateModified: 'August 27, 2020 14:52'},
    {name: 'Sample folder', dateCreated: 'August 27, 2020 13:52', dateModified: 'August 27, 2020 14:52'},
    {name: 'Sample folder', dateCreated: 'August 27, 2020 13:52', dateModified: 'August 27, 2020 14:52'},
    {name: 'Sample folder', dateCreated: 'August 27, 2020 13:52', dateModified: 'August 27, 2020 14:52'},
    {name: 'Sample folder', dateCreated: 'August 27, 2020 13:52', dateModified: 'August 27, 2020 14:52'},
  ]

  public colsMembers: any[];
  public members: any = [
    {name: 'Jhon Doe'},
    {name: 'Jhon Doe'},
    {name: 'Jhon Doe'},
    {name: 'Jhon Doe'},
    {name: 'Jhon Doe'},
    {name: 'Jhon Doe'},
    {name: 'Jhon Doe'},
    {name: 'Jhon Doe'}
  ]

  constructor(public translateService: TranslateService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'document.document_name' },
      { field: 'dateCreated', header: 'document.date_created' },
      { field: 'dateModified', header: 'document.date_modified' }
    ];

    this.colsMembers = [
      { field: 'name', header: 'account.name' }
    ];
  }

}
