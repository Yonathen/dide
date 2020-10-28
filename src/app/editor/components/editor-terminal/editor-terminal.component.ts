import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { EditorState } from 'src/app/navigation.service';
import { util } from 'api/server/lib/util';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editor-terminal',
  templateUrl: './editor-terminal.component.html',
  styleUrls: ['./editor-terminal.component.scss']
})
export class EditorTerminalComponent implements OnInit, OnChanges {
  @Input() editorState: EditorState;
  @ViewChild('terminal') terminal: ElementRef;

  @Input() event: Observable<void>;

  ngOnInit(){
    this.event.subscribe(() => this.scroll());
  }

  constructor() { }

  get output(): any[] {
    let result = [];
    if (this.editorState && this.editorState.output) {
      result = this.editorState.output;
    }
    return result;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.editorState ) {
      this.scroll();
    }
  }

  isEmpty(value) {
    return util.isEmpty(value);
  }

  scroll() {
    setTimeout(() => {
      const body = this.terminal.nativeElement.getElementsByClassName('terminal__content')[0];
      body.scrollTop = body.scrollHeight;
    });
  }

}
