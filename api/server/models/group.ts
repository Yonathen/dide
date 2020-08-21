import { DateTime } from './utility-date-time';
import { User } from './user';

export enum RequestStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
    Blocked = 'blocked'
}

export enum GroupType {
    Closed = 'closed',
    Open = 'open'
}

export enum MemberType {
    Admin = 'Admin',
    User = 'User'
}

export interface Member {
    user: User;
    requestedDate: Date;
    acceptedDate?: Date;
    requestStatus: RequestStatus;
    memberType: MemberType
}


export interface Group {
    _id: string;
    name: string;
    createdBy: User;
    createdOn: Date;
    members: Member[];
    type: GroupType;

    /*
    makeMemebershipRequest(user: User): any;
    acceptRequest(member: Member): any;
    rejectRequest(member: Member): any;
    notifyAcceptedMember(user: User): any;
    */

}

export function isUserInGroup(user: User, group: Group): boolean {
    const userIndex = group.members.findIndex( member => member.user._id === user._id );
    return (userIndex !== -1);
}

export function castUserToMember(newUser: User, memberType: MemberType = MemberType.User): Member {
    return {
        user: newUser,
        requestedDate: new Date(),
        requestStatus: RequestStatus.Pending,
        memberType: memberType
    } as Member;
}