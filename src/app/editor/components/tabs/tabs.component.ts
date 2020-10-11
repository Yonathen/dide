import { Component, OnInit, Input } from '@angular/core';
import { FileFolder } from 'api/server/models/file-folder';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  document: FileFolder;

  constructor(
    private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.document.subscribe(openedDocument => {
      this.document = openedDocument;
    });
  }

}
