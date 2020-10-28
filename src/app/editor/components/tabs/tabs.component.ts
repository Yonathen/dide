import { AccountService } from 'src/app/shared/services/account.service';
import { SettingPreference } from 'api/server/models/setting-preference';
import { EditorState } from './../../../navigation.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FileFolder } from 'api/server/models/file-folder';
import { NavigationService } from 'src/app/navigation.service';
import { EditorTabTag } from '../../editor.component';
import 'brace';
import 'brace/ext/searchbox';

import 'brace/theme/ambiance';
import 'brace/theme/chaos';
import 'brace/theme/chrome';
import 'brace/theme/dawn';
import 'brace/theme/dracula';
import 'brace/theme/dreamweaver';
import 'brace/theme/eclipse';
import 'brace/theme/github';
import 'brace/theme/gob';
import 'brace/theme/iplastic';
import 'brace/theme/merbivore_soft';
import 'brace/theme/mono_industrial';
import 'brace/theme/monokai';
import 'brace/theme/solarized_dark';
import 'brace/theme/textmate';
import 'brace/theme/tomorrow';
import 'brace/theme/tomorrow_night';
import 'brace/theme/tomorrow_night_blue';
import 'brace/theme/tomorrow_night_bright';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/theme/twilight';
import 'brace/theme/twilight';
import 'brace/theme/vibrant_ink';
import 'brace/theme/vibrant_ink';
import 'brace/theme/xcode';
import { AceEditorComponent } from 'ng2-ace-editor';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  editorState: EditorState;
  preference: SettingPreference;

  @ViewChild('editor') editor: AceEditorComponent;

  constructor(
    private accountService: AccountService,
    private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigationService.active.subscribe(activeState => {
      this.editorState = activeState;
    });

    this.accountService.preference.subscribe(preference => {
      this.preference = preference;
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
