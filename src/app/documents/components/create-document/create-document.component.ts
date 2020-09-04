import { util } from 'api/server/lib/util';
import { DocumentService } from './../../services/document.service';
import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api/menuitem';
import { Access, FileFolder, FilePrivacy, FileType, castToFileFolder } from 'api/server/models/file-folder';
import { User } from 'api/server/models/user';
import { Group } from 'api/server/models/group';
import { GroupService } from 'src/app/group/services/group.service';
import { SelectItem } from 'primeng/api/selectitem';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api/treenode';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

interface MembersTableValue {
  userId: string;
  name: string;
  email: string;
}

interface FolderTableValue {
  folderId: string;
  name: string;
  dateCreated: Date;
}

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.scss']
})
export class CreateDocumentComponent implements OnInit, OnChanges {
  @Input() visible: boolean;
  public documents: TreeNode[];
  public selectedTreeNode: TreeNode;
  public colsFolderTable: any[];
  public accessItems: MenuItem[];
  public folderTableValues: FolderTableValue[] = [];
  public folderSelected: FileFolder;
  public folderSelectedPath: string[] = [];

  public groups: Group[];
  public colsMembersTable: any[];
  public groupDropdownItems: SelectItem[];
  public membersTableValues: MembersTableValue[] = [];

  public accessLabels: string[] = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];

  public submitted: boolean;
  public createDocumentForm: FormGroup;
  public failedMessage: string;

  public fileTypeOpt = FileType;
  public privacyOpt: SelectItem[];
  public accessOpt: SelectItem[];

  @Output('cancel') cancelEmitter: EventEmitter<any> = new EventEmitter<any>();

  private _subscriptions = new Subscription();

  constructor(
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private groupService: GroupService,
    private documentService: DocumentService) { }

  ngOnInit(): void {

    const keys = ['common.private', 'common.public'];
    const translationSubscription = this.translateService.stream(keys).pipe(
      tap(translations => {
        this.privacyOpt = [
          { label: translations['common.public'], value: FilePrivacy.Public },
          { label: translations['common.private'], value: FilePrivacy.Private }
        ];
        this.changeDetectorRef.detectChanges();
      })
    ).subscribe();
    this._subscriptions.add(translationSubscription);

    this.colsFolderTable = [
      { field: 'name', header: 'document.document_name' }
    ];

    this.colsMembersTable = [
      { field: 'name', header: 'account.name' },
      { field: 'email', header: 'account.email' }
    ];

    this.accessOpt = this.accessLabels.map( (elt, index) => {
      return { label: elt, value: index };
    });


  }

  get path(): string {
    if (this.folderSelectedPath.length > 0) {
      return this.folderSelectedPath.join('/');
    }
    return '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes.visible && this.visible ) {
      this.loadDocument(FilePrivacy.Private);
      this.loadGroup();

      this.submitted = false;
      this.failedMessage = null;
      this.setUpForm();
    }
  }

  setUpForm() {
    this.createDocumentForm = this.formBuilder.group({
      name: [ {value: null, disabled: false}, Validators.required ],
      type: [ {value: FileType.File, disabled: false}, Validators.required ],
      privacy: [ {value: FilePrivacy.Private, disabled: false}, Validators.required ],
      group: [ {value: null, disabled: false} ],
      owner: [ {value: 7, disabled: true}, Validators.required ],
      member: [ {value: 5, disabled: false}, Validators.required ],
      other: [ {value: 5, disabled: false}, Validators.required ]
    });
  }

  loadDocument(privacy: FilePrivacy) {
    if ( privacy === FilePrivacy.Public ) {
      this.documentService.fetchPublicDocuments().then( result => {
        if ( result.success ) {
          this.documents = result.returnValue;
        }
      });
    } else if (privacy === FilePrivacy.Private) {
      this.documentService.fetchPrivateDocuments().then( result => {
        if ( result.success ) {
          this.documents = result.returnValue;
        }
      });
    }
  }

  loadGroup() {
    this.groupService.fetchMyGroup().then( result => {
      if ( result.success ) {
        this.groups = result.returnValue;
        this.castGroupsToSelectItem();
      }
    });
  }

  onChangePrivacy(event) {
    this.loadDocument(event.target.value);
  }

  castMembersToTable(group: Group) {
    this.membersTableValues.splice(0, this.membersTableValues.length);
    group.members.forEach(member => {
      const castedMember: MembersTableValue = {
        userId: member.user._id,
        name: member.user.profile.firstName + ' ' + member.user.profile.lastName,
        email: member.user.emails[0].address
      };
      this.membersTableValues.push(castedMember);
    });
  }

  castGroupsToSelectItem() {
    this.groupDropdownItems = this.groups.map( group => {
      return {label: group.name, value: group};
    });
  }

  getParent(node: TreeNode, tree?: TreeNode[]): TreeNode {
    if (!util.valueExist(tree)) {
      tree = this.documents;
    }

    let result: TreeNode;
    for ( const n of tree ) {
      if ( n.children.findIndex(elt => elt.key === node.key) >= 0 ) {
        result = n;
        break;
      }
    }

    if ( !util.valueExist(result) ) {
      for ( const n of tree ) {
        const r = this.getParent(node, n.children);
        if ( util.valueExist(r) ) {
          result = r;
          break;
        }
      }
    }

    return result;
  }

  setPath(node: TreeNode) {
    this.folderSelectedPath.splice(0, 0, node.data.name);

    if ( node.data.parent !== 'root' ) {
      const parent: TreeNode = this.getParent(node);
      this.setPath(parent);
    } else {
      this.folderSelectedPath.splice(0, 0, node.data.privacy);
    }
  }

  nodeSelect(event) {
    this.folderSelectedPath.splice(0, this.folderSelectedPath.length);
    this.folderSelected = event.node.data;
    this.setPath(event.node);
    this.changeDetectorRef.detectChanges();
  }

  nodeUnselect(event) {
    this.folderSelectedPath.splice(0, this.folderSelectedPath.length);
    this.folderSelected = null;
    this.changeDetectorRef.detectChanges();
  }

  failedValidation(componentName: string) {
    return this.createDocumentForm.get(componentName).invalid && this.submitted;
  }

  isFormInvalid(): boolean {
    return util.valueExist(this.failedMessage);
  }

  create() {
    this.submitted = true;
    if ( this.createDocumentForm.valid ) {
      this.failedMessage = null;
      const selectedLocation: string = util.valueExist(this.folderSelected) ? this.folderSelected._id : 'root';
      this.documentService.createDocument(this.createDocumentForm.value, selectedLocation).then( result => {
        if ( result.success ) {
          this.cancel(this.createDocumentForm.value);
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

  cancel(created?: any) {
    this.setUpForm();
    this.submitted = false;
    this.failedMessage = null;
    this.cancelEmitter.emit(created);
  }
}
