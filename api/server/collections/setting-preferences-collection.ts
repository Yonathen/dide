import { SettingExecutor } from './../models/setting-executor';
import { SettingLanguage } from './../models/setting-language';
import { SettingSolver } from './../models/setting-solver';
import { MongoObservable } from 'meteor-rxjs';
import { SettingPreference } from '../models/setting-preference';
import { SettingTheme } from '../models/setting-theme';
import { UserType } from '../models/user';

export const SettingPreferencesCollection = new MongoObservable.Collection<SettingPreference>('preferences');


export function castToSettingPreference(
  language: SettingLanguage,
  programingLanguage: SettingLanguage,
  solver: SettingSolver,
  theme: SettingTheme,
  executor: SettingExecutor,
  other: any = [],
  userType: UserType = UserType.Member): SettingPreference {
  return {
    language,
    programingLanguage,
    solver,
    theme,
    executor,
    other,
    userType
  } as SettingPreference;
}
