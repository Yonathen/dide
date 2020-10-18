import { MongoObservable } from 'meteor-rxjs';
import { SettingPreference } from '../models/setting-preference';

export const SettingPreferencesCollection = new MongoObservable.Collection<SettingPreference>('preferences');
