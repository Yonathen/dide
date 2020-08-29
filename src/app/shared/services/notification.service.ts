import { Injectable } from '@angular/core';
import { R } from 'api/server/lib/response';
import { NotifyMessage } from '../model/notify-message';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  fetchNotification(): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('getUserNotification', (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  notifyUser(notifyMessage: NotifyMessage): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('sendNotificationToUser', notifyMessage.title, notifyMessage.message, notifyMessage.notifyTo, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  markAsSeen(notificationId: string): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('markAsSeenNotification', notificationId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  remove(notificationId: string): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('removeNotification', notificationId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }
}
