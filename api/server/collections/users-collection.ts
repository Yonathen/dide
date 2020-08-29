import { User } from '../models/user';
import { MongoObservable } from 'meteor-rxjs';


export const UsersCollection = new MongoObservable.Collection<User>(Meteor.users);
UsersCollection.collection._ensureIndex( { "email": "text", "profile.firstName": "text", "profile.lastName": "text" } );