import { FileFolder } from 'api/server/models/file-folder';
import { DocumentService } from './../../services/document.service';
import { MenuItem, TreeNode } from 'primeng/api';
import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { util } from 'api/server/lib/util';

@Component({
  selector: 'app-rename-document',
  templateUrl: './rename-document.component.html',
  styleUrls: ['./rename-document.component.scss']
})
export class RenameDocumentComponent implements OnInit, OnChanges {
  @Input() visible: boolean;
  @Input() selectedDocument: FileFolder;
  @Input() breadcrumbItems: MenuItem[];

  @Output('cancel') cancelEmitter: EventEmitter<any> = new EventEmitter<any>();

  public documentName: string = '';
  public submitted: boolean;
  public failedMessage: string;

  get path() {
    let path = '';
    if (util.valueExist(this.selectedDocument) ) {
      for ( const item of this.breadcrumbItems ) {
        path += item.label + '/';
      }
      path += this.selectedDocument.name;
    }
    return path;
  }

  constructor(private documentService: DocumentService) { }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes.visible && changes.visible.currentValue ) {
      this.submitted = false;
    }

    if (changes.selectedDocument && changes.selectedDocument.currentValue) {
      this.documentName = this.selectedDocument.name;
    }
  }

  ngOnInit(): void {
  }

  failedValidation() {
    return this.documentName === '' && this.submitted;
  }

  isFormInvalid(): boolean {
    return util.valueExist(this.failedMessage);
  }

  cancel(renamed?: any) {
    this.submitted = false;
    this.cancelEmitter.emit(renamed);
  }

  save() {
    this.submitted = true;
    if ( this.documentName !== '' ) {
      this.documentService.renameDocument(this.selectedDocument._id, this.documentName).then( result => {
        if ( result.success ) {
          this.cancel(this.selectedDocument);
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

}
