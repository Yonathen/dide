import { MongoObservable } from 'meteor-rxjs';
import { SettingTheme } from '../models/setting-theme';

export const SettingThemesCollection = new MongoObservable.Collection<SettingTheme>('setting-themes');
