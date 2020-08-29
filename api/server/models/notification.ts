import { User } from './user';
import { DateTime } from './utility-date-time';

export enum NotificationStatus {
    Seen = 'Seen',
    New = 'New'

}

export interface Notification {
    _id: string;
    date: Date;
    title: string;
    message: string;
    status: NotificationStatus;
    user: User;
}

export function castToNotification(title:string, message: string, user: User): Notification {
    return {
        date: new Date(),
        title: title,
        message: message,
        status: NotificationStatus.New,
        user: user
    } as Notification;
}