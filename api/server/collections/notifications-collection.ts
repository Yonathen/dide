import { MongoObservable } from 'meteor-rxjs';
import { Notification } from 'server/models/notification';

export const NotificationsCollection = new MongoObservable.Collection<Notification>('notifications');