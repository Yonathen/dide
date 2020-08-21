import { User } from './user';
import { DateTime } from './utility-date-time';

export enum NotificationStatus {
    Seen = 'Seen',
    New = 'New'

}

export interface Notification {
    _id: string;
    date: Date;
    message: string;
    status: NotificationStatus;
    user: User;
}

export function castToNotification(message: string, user: User): Notification {
    return {
        date: new Date(),
        message: message,
        status: NotificationStatus.New,
        user: user
    } as Notification;
}