import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-create-appearance',
  templateUrl: './create-appearance.component.html',
  styleUrls: ['./create-appearance.component.scss']
})
export class CreateAppearanceComponent implements OnInit {
  @ViewChild('scriptFileInput') scriptFileInput: ElementRef;
  @ViewChild('styleFileInput') styleFileInput: ElementRef;
  public scriptFile:File[] = [];
  public styleFile:File[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  scriptUploader(event) {
    if (event.files && event.files.length > 0) {
      this.scriptFile[0] = event.files[0];
      let fileInput:HTMLInputElement = <HTMLInputElement> this.scriptFileInput.nativeElement;
      fileInput.value = this.scriptFile[0].name;
    }
  }

  styleUploader(event) {
    if (event.files && event.files.length > 0) {
      this.styleFile[0] = event.files[0];
      let fileInput:HTMLInputElement = <HTMLInputElement> this.styleFileInput.nativeElement;
      fileInput.value = this.styleFile[0].name;
    }
  }
}
