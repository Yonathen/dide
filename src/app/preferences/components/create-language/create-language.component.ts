import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-create-language',
  templateUrl: './create-language.component.html',
  styleUrls: ['./create-language.component.scss']
})
export class CreateLanguageComponent implements OnInit {

  @ViewChild('languageFileInput') languageFileInput: ElementRef;
  public languageFile: File[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  languageUploader(event) {
    if (event.files && event.files.length > 0) {
      this.languageFile[0] = event.files[0];
      const fileInput: HTMLInputElement = this.languageFileInput.nativeElement;
      fileInput.value = this.languageFile[0].name;
    }
  }
}
