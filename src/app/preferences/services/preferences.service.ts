import { Injectable } from '@angular/core';
import { R } from 'api/server/lib/response';
import { PreferenceOptions } from 'api/server/models/preference-options';
import { castToSettingPreference, SettingPreference } from 'api/server/models/setting-preference';

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

  updatePreference(formValue: SettingPreference, options: PreferenceOptions[] ): Promise<R> {
    const requestPreference: SettingPreference = castToSettingPreference(
      formValue.language, formValue.programingLanguage,
      formValue.solver, formValue.theme, formValue.executor, options);

    return new Promise<R>((resolve, reject) => {
      Meteor.call('updatePreference', requestPreference, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });
    });
  }
}
