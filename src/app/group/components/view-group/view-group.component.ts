import { util } from './../../../../../api/server/lib/util';
import { Component, OnInit, Input } from '@angular/core';
import { Group } from 'api/server/models/group';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss']
})
export class ViewGroupComponent implements OnInit {

  @Input() group: Group;
  cols: any[];

  constructor() { }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'account.name' },
      { field: 'status', header: 'common.status' }
    ];
  }

  isGroup(): boolean {
    return util.valueExist(this.group);
  }

}
