import { FilterFileFolder, FilterResult } from './../../../../api/server/models/file-folder';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'searchResult'
})
export class SearchResultPipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) {
  }

  transform(value: FilterResult): unknown {

    let prefix = '';
    if ( value.from !== 0 ) {
      prefix = value.textSnippet.substring(0, value.from);
    }

    let suffix = '';
    if ( value.end !== value.textSnippet.length ) {
      suffix = value.textSnippet.substring(value.end, value.textSnippet.length);
    }

    return this.sanitized.bypassSecurityTrustHtml(`${prefix}<span style="border: solid 1px #fff; background-color: #000;">${value.textSnippet.substring(value.from, value.end)}</span>${suffix}`);
  }

}
