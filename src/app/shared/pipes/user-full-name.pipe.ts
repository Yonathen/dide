import { User } from './../../../../api/server/models/user';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFullName'
})
export class UserFullNamePipe implements PipeTransform {

  transform(value: User): unknown {
    return `${ value.profile.firstName } ${ value.profile.lastName }`;
  }

}
