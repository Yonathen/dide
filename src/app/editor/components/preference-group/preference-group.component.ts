import { Component, OnInit, Input } from '@angular/core';
import { Group, Member, GroupType } from 'api/server/models/group';
import { User } from 'api/server/models/user';
import { util } from 'api/server/lib/util';

interface GroupDetail {
    _id?: string;
    name: string;
    createdBy: User;
    createdOn: Date;
    type: GroupType;
}

@Component({
  selector: 'app-preference-group',
  templateUrl: './preference-group.component.html',
  styleUrls: ['./preference-group.component.scss']
})
export class PreferenceGroupComponent implements OnInit {

  public util = util;
  @Input() group: Group;

  get groupDetail(): GroupDetail {
    if ( this.group ) {
      return {
        _id: this.group._id,
        name: this.group.name,
        createdBy: this.group.createdBy,
        createdOn: this.group.createdOn,
        type: this.group.type
      } as GroupDetail;
    }

    return;
  }

  get members(): Member[] {
    let result = [];

    if ( this.group && this.group.members ) {
      result = this.group.members;
    }

    return result;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
