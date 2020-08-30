import { Injectable } from '@angular/core';
import { R } from 'api/server/lib/response';
import { Group, castToGroup, RequestStatus } from 'api/server/models/group';
import { User } from 'api/server/models/user';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor() { }

  fetchMyGroup(): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('getUserGroups', (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  fetchMemberGroup(requestStatus: RequestStatus = RequestStatus.Accepted): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('getUserMemberGroups', requestStatus, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  createGroup(formValues: any, memberUsers: User[]): Promise<R> {
    const clonedMembers = _.clone(memberUsers);
    clonedMembers.push(Meteor.user());
    const group = castToGroup(formValues.name, formValues.type, clonedMembers);
    return new Promise<R>((resolve, reject) => {
      Meteor.call('createGroup', group, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  updateGroup(formValues: any, memberUsers: User[], groupId: string): Promise<R> {
    const clonedMembers = _.clone(memberUsers);
    const group = castToGroup(formValues.name, formValues.type, clonedMembers);
    return new Promise<R>((resolve, reject) => {
      Meteor.call('updateGroup', groupId, group, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  renameGroup(newName:string, groupId: string): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('renameGroup', newName, groupId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  removeGroup(groupId: string): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('removeGroup', groupId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  searchMembers(keywords: string, groupId?: string) {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('searchUser', keywords, groupId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  addMembers(user: User, groupId: string): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('addMember', user, groupId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  acceptMembership(groupId: string): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Meteor.call('acceptMembership', groupId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });
  }

  removeMember(user: User, groupId: string): Promise<R> {

    return new Promise<R>((resolve, reject) => {
      Meteor.call('removeMember', user, groupId, (error, result) => {
        if (error) {
          return resolve(error);
        }
        resolve(result);
      });

    });

  }
}
