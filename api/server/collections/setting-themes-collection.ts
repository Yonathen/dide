import { MongoObservable } from 'meteor-rxjs';
import { SettingTheme } from 'server/models/setting-theme';

export const SettingThemesCollection = new MongoObservable.Collection<SettingTheme>('setting-themes');