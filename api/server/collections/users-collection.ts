import { User } from '../models/user';
import { MongoObservable } from 'meteor-rxjs';


export const UsersCollection = new MongoObservable.Collection<User>(Meteor.users);
