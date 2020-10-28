import { MongoObservable } from 'meteor-rxjs';
import { Notification } from '../models/notification';

export const NotificationsCollection = new MongoObservable.Collection<Notification>('notifications');
