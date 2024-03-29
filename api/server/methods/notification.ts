import { Meteor } from 'meteor/meteor';
import { UserAccount } from '../models/user-account';
import { response, R } from '../lib/response';
import { util } from '../lib/util';
import { Notification, castToNotification, NotificationStatus } from '../models/notification';
import { GroupsCollection } from '../collections/groups-collection';
import { Group } from '../models/group';
import { NotificationsCollection } from '../collections/notifications-collection';
import { UsersCollection } from '../collections/users-collection';
import { User } from '../models/user';
import { ObservableCursor } from 'meteor-rxjs';

Meteor.methods({

    sendNotificationToUser(notification: Notification): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const user: User = UsersCollection.collection.findOne({ _id: { $eq: notification.user._id }});
            if ( !util.valueExist(user) ) {
                throw new Meteor.Error('User does not exist');
            }
            const result = NotificationsCollection.collection.insert(notification);
            if ( result ) {
                return response.fetchResponse(result);
            } else {
                throw new Meteor.Error('Unable to notify user.');
            }
        }
        catch (error){
            return response.fetchResponse(error, false);
        }
    },

    markAsSeenNotification(notificationId: string) {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const setValues = { status: NotificationStatus.Seen };
            const notification: Notification = NotificationsCollection.collection.findOne({ _id: { $eq: notificationId}});
            if (!util.valueExist(notification)) {
                throw new Meteor.Error('Notification not found.');
            }

            const updated = NotificationsCollection.collection.update(notification._id, { $set: setValues });
            if ( updated ) {
                return response.fetchResponse();
            } else {
                throw new Meteor.Error('Unable to mark notification as seen.');
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    },

    removeNotification(notificationId: string) {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }
            const updated = NotificationsCollection.collection.remove(notificationId);
            if ( updated ) {
                return response.fetchResponse();
            } else {
                throw new Meteor.Error('Unable to remove notification.');
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    },

    clearNotification() {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            let success: boolean = true;
            let userNotifications = NotificationsCollection.collection.find({ 'user._id': { $eq: this.userId}});
            userNotifications.forEach(userNotification => {
                const removed = NotificationsCollection.collection.remove(userNotification._id);
                if (!util.valueExist(removed)) {
                    success = false;
                }
            });
            if ( success ) {
                return response.fetchResponse();
            } else {
                throw new Meteor.Error('Unable to remove some or all notifications.');
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    }

})
