import { GroupType } from './../../../../../api/server/models/group';
import { GroupService } from './../../services/group.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'api/server/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { util } from 'api/server/lib/util';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  public cols: any[];
  public suggestions: User[] = [];
  public members: User[] = [];
  public groupType = GroupType;

  public submitted: boolean;
  public createGroupForm: FormGroup;
  public failedMessage: string;
  @Output('cancel') cancelEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private groupService: GroupService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'account.name' },
      { field: 'email', header: 'account.email' }
    ];

    this.loadUsers();

    this.submitted = false;
    this.failedMessage = null;
    this.setUpForm();
  }

  setUpForm() {
    this.createGroupForm = this.formBuilder.group({
      name: [ {value: null, disabled: false}, Validators.required ],
      type: [ {value: GroupType.Open, disabled: false}, Validators.required ]
    });
  }

  failedValidation(componentName: string) {
    return this.createGroupForm.get(componentName).invalid && this.submitted;
  }

  isFormInvalid(): boolean {
    return util.valueExist(this.failedMessage);
  }

  create() {
    this.submitted = true;
    if ( this.createGroupForm.valid && this.hasMembers() ) {
      this.failedMessage = null;
      this.groupService.createGroup(this.createGroupForm.value, this.members).then((result) => {
        if ( result.success ) {
          this.cancel(true);
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

  cancel(created: boolean = false) {
    this.setUpForm();
    this.members.splice(0, this.members.length);
    this.submitted = false;
    this.failedMessage = null;
    this.cancelEmitter.emit(created);
  }

  loadUsers(keyword: string = '') {
    this.groupService.searchMembers(keyword).then(result => {

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

  removeMember(user: User) {
    const index = this.members.findIndex(elt => elt._id === user._id);
    this.members.splice(index, 1);
    this.suggestions.push(user);
  }

}
