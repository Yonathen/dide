import { MongoObservable } from 'meteor-rxjs';
import { SettingSolver } from '../models/setting-solver';

export const SettingSolversCollection = new MongoObservable.Collection<SettingSolver>('setting-solvers');
