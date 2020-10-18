import { Injectable } from '@angular/core';
import { R } from 'api/server/lib/response';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor() { }

  getSettings(type: string) {
    return new Promise<R>((resolve, reject) => {
      Meteor.call(type, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }
}
