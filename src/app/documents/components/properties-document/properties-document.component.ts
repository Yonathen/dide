import { Member, Group } from './../../../../../api/server/models/group';
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FileFolder, FilePrivacy } from 'api/server/models/file-folder';
import { MenuItem } from 'primeng/api/menuitem';
import { SelectItem } from 'primeng/api/selectitem';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'src/app/group/services/group.service';
import { MembersTableValue } from '../create-document/create-document.component';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-properties-document',
  templateUrl: './properties-document.component.html',
  styleUrls: ['./properties-document.component.scss']
})
export class PropertiesDocumentComponent implements OnInit, OnChanges {

  @Input() selectedDocument: FileFolder;
  @Input() breadcrumbItems: MenuItem[];

  public colsMembers: any[];

  public groups: Group[];
  public groupDropdownItems: SelectItem[];
  public membersTableValues: MembersTableValue[] = [];

  public accessLabels: string[] = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
  public accessOpt: SelectItem[];

  public privacyForm: FormGroup;
  public groupForm: FormGroup;

  @Output('cancel') cancelEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  get path(): string {
    let path = '';

    this.breadcrumbItems.forEach((item, index) => {
      if ( index !== 0 ) {
        path += '/';
      }
      path += item.label;
    });

    return path;
  }

  get documentMembers(): Member[] {
    const members: Member[] = [];

    if ( this.selectedDocument &&
      this.selectedDocument.group &&
      this.selectedDocument.group.members ) {
        this.selectedDocument.group.members.forEach((member) => {
          members.push(member);
        });
    }

    return members;
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private groupService: GroupService,
    private documentService: DocumentService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.colsMembers  = [
      { field: 'name', header: 'account.name' },
      { field: 'email', header: 'account.email' }
    ];

    this.accessOpt = this.accessLabels.map( (elt, index) => {
      return { label: elt, value: index };
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.selectedDocument && this.selectedDocument ) {
      this.loadGroup();
      this.setUpPrivacyForm();
      this.setUpGroupForm();
      this.castMembersToTable(this.selectedDocument.group);
    }
  }

  isOwner(): boolean {
    return (this.selectedDocument.owner._id === Meteor.user()._id);
  }

  setUpPrivacyForm() {
    this.privacyForm = this.formBuilder.group({
      privacy: [ {value: this.selectedDocument.privacy, disabled: !this.isOwner()}, Validators.required ],
      owner: [ {value: this.selectedDocument.memberAccess.owner, disabled: true}, Validators.required ],
      member: [ {value: this.selectedDocument.memberAccess.group, disabled: !this.isOwner()}, Validators.required ],
      other: [ {value: this.selectedDocument.memberAccess.other, disabled: !this.isOwner()}, Validators.required ]
    });
  }

  setUpGroupForm() {
    this.groupForm = this.formBuilder.group({
      group: [ {value: this.selectedDocument.group, disabled: !this.isOwner()}],
    });
  }

  loadGroup() {
    if ( this.isOwner() ) {
      this.groupService.fetchMyGroup().then( result => {
        if ( result.success ) {
          this.groups = result.returnValue;
          this.castGroupsToSelectItem();
        }
      });
    } else {
      this.groups = [this.selectedDocument.group];
      this.castGroupsToSelectItem();
    }
  }

  castGroupsToSelectItem() {
    this.groupDropdownItems = this.groups.map( group => {
      return {label: group.name, value: group};
    });
  }

  castMembersToTable(group: Group) {
    this.membersTableValues.splice(0, this.membersTableValues.length);
    if ( group ) {
      group.members.forEach(member => {
        const castedMember: MembersTableValue = {
          userId: member.user._id,
          name: member.user.profile.firstName + ' ' + member.user.profile.lastName,
          email: member.user.emails[0].address
        };
        this.membersTableValues.push(castedMember);
      });
    }
    this.changeDetectorRef.detectChanges();
  }

  saveSettings() {
    const formValues = { ...this.groupForm.value, ...this.privacyForm.value };
    this.documentService.updateDocumentSettings(formValues, this.selectedDocument._id).then( result => {
      if ( result.success ) {
        this.cancel(true);
      }
    });
  }

  cancel(created?: any) {
    this.cancelEmitter.emit(created);
  }
}
