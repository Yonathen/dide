import { SettingExecutor } from '../models/setting-executor';
import { MongoObservable } from 'meteor-rxjs';

export const SettingExecutorCollection = new MongoObservable.Collection<SettingExecutor>('setting-executors');
