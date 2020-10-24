import { MongoObservable } from 'meteor-rxjs';
import { SettingLanguage } from '../models/setting-language';

export const SettingLanguagesCollection = new MongoObservable.Collection<SettingLanguage>('setting-languages');
