import { MongoObservable } from 'meteor-rxjs';
import { SettingLanguage } from 'server/models/setting-language';

export const SettingLanguagesCollection = new MongoObservable.Collection<SettingLanguage>('setting-languages');