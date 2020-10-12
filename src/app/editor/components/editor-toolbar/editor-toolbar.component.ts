import { LoideToolbarItems } from './../../enums/loide-toolbar-items.enum';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editor-toolbar',
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.scss']
})
export class EditorToolbarComponent implements OnInit {

  toolbarEvent = LoideToolbarItems;

  @Output() toolbarClicked: EventEmitter<LoideToolbarItems> = new EventEmitter<LoideToolbarItems>();
  constructor() { }

  ngOnInit(): void {
  }

  emitToolbarClick(action: LoideToolbarItems) {
    this.toolbarClicked.emit(action);
  }

}
