import { MongoObservable } from 'meteor-rxjs';
import { Group } from '../models/group';

export const GroupsCollection = new MongoObservable.Collection<Group>('groups');
