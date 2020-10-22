import { Component, OnInit, Input, Output } from '@angular/core';
import { EditorState } from 'src/app/navigation.service';

@Component({
  selector: 'app-editor-terminal',
  templateUrl: './editor-terminal.component.html',
  styleUrls: ['./editor-terminal.component.scss']
})
export class EditorTerminalComponent implements OnInit {
  @Input() editorState: EditorState;

  constructor() { }

  get output(): any[] {
    let result = [];
    if (this.editorState && this.editorState.output) {
      result = this.editorState.output;
    }
    return result;
  }

  ngOnInit(): void {
  }

}
