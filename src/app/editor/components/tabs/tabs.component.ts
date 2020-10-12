import { EditorState } from './../../../navigation.service';
import { Component, OnInit, Input } from '@angular/core';
import { FileFolder } from 'api/server/models/file-folder';
import { NavigationService } from 'src/app/navigation.service';
import { EditorTabTag } from '../../editor.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  editorState: EditorState;

  constructor(
    private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.active.subscribe(activeState => {
      this.editorState = activeState;
    });
  }

  onTextChange(content: string) {
    const persisted: FileFolder = this.editorState.persistedDocument;
    if ( content !== persisted.content ) {
      this.navigationService.documentChanged(EditorTabTag + persisted._id);
    } else {
      this.navigationService.documentChanged(EditorTabTag + persisted._id, false);
    }
  }

}
