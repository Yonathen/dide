import { Component, OnInit } from '@angular/core';
import { EventSidebar } from './model/event-sidebar';
import { ScriptLoaderService } from './services/script-loader.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public content: any;
  public sidebarEvent: EventSidebar;
  public sidebarLeft: boolean;
  public sidebarRight: boolean;

  constructor(public scriptLoaderService: ScriptLoaderService) {
    
  }

  ngOnInit(): void {
    this.scriptLoaderService.load('jquery', 'popper', 'bootstrap').then(data => {
      console.log(data);
    }).catch(error => console.log(error));
  }

  get sidebarLeftVisible(): boolean {
    return this.sidebarLeft;
  }

  get sidebarRightVisible(): boolean {
    return this.sidebarRight;
  }

  toogleSidebarLeft($event: EventSidebar) {
    this.sidebarEvent = $event; 

    if (this.sidebarEvent.left) {
      this.sidebarLeft = this.sidebarEvent.visible;
    } else if (this.sidebarEvent.right) {
      this.sidebarRight = this.sidebarEvent.visible;
    }
  }

  isSingleBarOpen(): boolean {
    if ((this.sidebarRight && !this.sidebarLeft) ||
      (!this.sidebarRight && this.sidebarLeft)) {
        return true;
      }
    return false;
  }

  isBothBarOpen(): boolean {
    if (this.sidebarRight && this.sidebarLeft) {
        return true;
      }
    return false;
  }
}
