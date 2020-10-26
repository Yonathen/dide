import { DocumentService } from './../../../documents/services/document.service';
import { FileFolder, FilterFileFolder } from './../../../../../api/server/models/file-folder';
import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api/treenode';

@Component({
  selector: 'app-preference-filter',
  templateUrl: './preference-filter.component.html',
  styleUrls: ['./preference-filter.component.scss']
})
export class PreferenceFilterComponent implements OnInit {


  public searchResult: FilterFileFolder[] = [];
  public keyword: string = '';

  constructor(private documentService: DocumentService) { }

  get resultCount() {
    let count = 0;
    if ( this.searchResult.length > 0) {
      this.searchResult.forEach(item => {
        count += item.filterResult.length;
      });
    }
    return count;
  }

  ngOnInit(): void {
  }

  clear() {
    this.keyword = '';
    this.searchResult.splice(0, this.searchResult.length);
  }

  search() {
    this.searchResult.splice(0, this.searchResult.length);
    this.documentService.filterFileFolder(this.keyword)
      .then(R => {
        if (R.success) {
          const returnValue: FilterFileFolder[] = R.returnValue;
          returnValue.forEach( item => this.searchResult.push(item))
        }
      });
  }

}
