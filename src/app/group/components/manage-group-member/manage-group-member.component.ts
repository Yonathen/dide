import { NotifyMessage } from './../../../shared/model/notify-message';
import { NotificationService } from './../../../shared/services/notification.service';
import { GroupType, Group } from './../../../../../api/server/models/group';
import { GroupService } from './../../services/group.service';
import { Component, OnInit, Output, Input, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'api/server/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { util } from 'api/server/lib/util';

@Component({
  selector: 'app-manage-group-member',
  templateUrl: './manage-group-member.component.html',
  styleUrls: ['./manage-group-member.component.scss']
})
export class ManageGroupMemberComponent implements OnInit, OnChanges {

  public cols: any[];
  public suggestions: User[] = [];
  public members: User[] = [];
  public groupType = GroupType;

  public submitted: boolean;
  public updateGroupForm: FormGroup;
  public failedMessage: string;

  @Input() selectedGroup: Group;
  @Output('cancel') cancelEmitter: EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor(
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'account.name' },
      { field: 'email', header: 'account.email' }
    ];


  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedGroup && util.valueExist(this.selectedGroup)) {
      this.loadUsers();

      this.submitted = false;
      this.failedMessage = null;
      this.setUpForm();
    }
  }

  setUpForm() {
    this.updateGroupForm = this.formBuilder.group({
      name: [ {value: this.selectedGroup.name, disabled: false}, Validators.required ],
      type: [ {value: this.selectedGroup.type, disabled: false}, Validators.required ]
    });

    this.members = this.selectedGroup.members.map(elt => elt.user);
  }

  failedValidation(componentName: string) {
    return this.updateGroupForm.get(componentName).invalid && this.submitted;
  }

  isFormInvalid(): boolean {
    return util.valueExist(this.failedMessage);
  }

  save() {
    this.submitted = true;
    if ( this.updateGroupForm.valid && this.hasMembers() ) {
      this.failedMessage = null;
      this.groupService.updateGroup(this.updateGroupForm.value, this.members, this.selectedGroup._id).then((result) => {
        if ( result.success ) {
          this.cancel(result.returnValue);
        } else {
          if ( result.errorValue && result.errorValue.message ) {
            this.failedMessage = result.errorValue.message;
          } else {
            this.failedMessage = 'Unknown error';
          }
        }
      });

    }
  }

  cancel(groupId?: string) {
    this.setUpForm();
    this.members.splice(0, this.members.length);
    this.submitted = false;
    this.failedMessage = null;
    this.selectedGroup = null;
    this.cancelEmitter.emit(groupId);
  }

  loadUsers(keyword: string = '') {
    if ( this.selectedGroup ) {
      this.groupService.searchMembers(keyword, this.selectedGroup._id).then(result => {

        this.suggestions.splice(0, this.suggestions.length);
        if (result.success && result.returnValue && result.returnValue.length > 0) {
          const users: User[]  = result.returnValue;
          users.forEach(user => {
            const index = this.members.findIndex(elt => elt._id === user._id);
            if ( index < 0 ) {
              this.suggestions.push(user);
            }
          });
        }
      });
    }
  }

  hasMembers(): boolean {
    return this.members.length > 0;
  }

  onSearchChange(event) {
    this.loadUsers(event.target.value);
  }

  selectMember(user: User) {
    const index = this.suggestions.findIndex(elt => elt._id === user._id);
    this.suggestions.splice(index, 1);
    this.members.push(user);
  }

  isMemberOwner(user: User): boolean {
    return user._id === this.selectedGroup.createdBy._id;
  }

  removeMember(user: User) {
    const index = this.members.findIndex(elt => elt._id === user._id);
    this.members.splice(index, 1);
    this.suggestions.push(user);
  }

}
