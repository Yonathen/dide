import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'access'
})
export class AccessPipe implements PipeTransform {

  transform(value: number): string {
    const accessString: string[] = [
      'No Read, No Write, No Execute', 'No Read, No Write, Execute',
      'No Read, Write, No Execute', 'No Read, Write, Execute',
      'Read, No Write, No Execute', 'Read, No Write, Execute',
      'Read, Write, No Execute', 'Read, Write, Execute'];
    if (value <= 7) {
      return accessString[value];
    }
    return;
  }

}
