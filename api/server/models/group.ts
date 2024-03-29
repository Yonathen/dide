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
    memberType: MemberType;
}


export interface Group {
    _id?: string;
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

export function castUserToMember(
  userM: User,
  memberTypeM: MemberType = MemberType.User,
  requestStatusM: RequestStatus = RequestStatus.Pending): Member {
    return {
        user: userM,
        requestedDate: new Date(),
        requestStatus: requestStatusM,
        memberType: memberTypeM
    } as Member;
}

export function castToGroup(groupName: string, groupType: GroupType, memberUsers: User[]): Group {
  const groupMembers: Member[] = memberUsers.map(user => {
    const memberType: MemberType = user._id === Meteor.userId() ? MemberType.Admin : MemberType.User;
    const requestStatus: RequestStatus = user._id === Meteor.userId() ? RequestStatus.Accepted : RequestStatus.Pending;
    return castUserToMember(user, memberType, requestStatus);
  });
  return {
    name: groupName,
    createdBy: Meteor.user(),
    createdOn: new Date(),
    members: groupMembers,
    type: groupType
  } as Group;
}
