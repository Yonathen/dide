import { MongoObservable } from 'meteor-rxjs';
import { SettingPreference } from 'server/models/setting-preference';

export const SettingPreferencesCollection = new MongoObservable.Collection<SettingPreference>('preferences');