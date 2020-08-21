import { MongoObservable } from 'meteor-rxjs';
import { Group } from 'server/models/group';

export const GroupsCollection = new MongoObservable.Collection<Group>('groups');