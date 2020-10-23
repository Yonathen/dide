import { SettingExecutor } from './../models/setting-executor';
import { SettingLanguage } from './../models/setting-language';
import { SettingSolver } from './../models/setting-solver';
import { MongoObservable } from 'meteor-rxjs';
import { SettingPreference } from '../models/setting-preference';
import { SettingTheme } from '../models/setting-theme';
import { UserType } from '../models/user';

export const SettingPreferencesCollection = new MongoObservable.Collection<SettingPreference>('preferences');
