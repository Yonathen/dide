import { User } from './user';
import { DateTime } from './utility-date-time';

export enum NotificationType {
  GroupRequest = 'GroupRequest',
  FileChange = 'FileChange',
}

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
    type: NotificationType;
    related?: any;
    user: User;
}

export function castToNotification(titleN: string, messageN: string, userN: User, typeN: NotificationType, relatedN?: any): Notification {
    return {
        date: new Date(),
        title: titleN,
        message: messageN,
        status: NotificationStatus.New,
        type: typeN,
        related: relatedN,
        user: userN
    } as Notification;
}
