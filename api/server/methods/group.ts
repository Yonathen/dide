import { NotificationsCollection } from './../collections/notifications-collection';
import { Meteor } from 'meteor/meteor';
import { response, R } from '../lib/response';
import { util } from '../lib/util';
import { Member, Group, castUserToMember, isUserInGroup, RequestStatus } from '../models/group';
import { GroupsCollection } from '../collections/groups-collection';
import { User } from '../models/user';
import { castToNotification, NotificationType, Notification } from '../models/notification';

Meteor.methods({

  createGroup(newGroup: Group): R {
    try {
      if ( !this.userId ) {
        throw new Meteor.Error('User is not logged.');
      }

      const newGroupId: string = GroupsCollection.collection.insert(newGroup);
      if (newGroupId) {
        const group = GroupsCollection.collection.findOne({ _id: { $eq: newGroupId}});
        group.members.forEach(member => {
          if ( member.user._id !== group.createdBy._id ) {
            const notification: Notification = castToNotification(
              'Group membership request',
              'You have membership request for group ' + group.name,
              member.user, NotificationType.GroupRequest, group
            );
            NotificationsCollection.collection.insert(notification);
          }
        });
        return response.fetchResponse(group);
      } else {
        throw new Meteor.Error('Unable to create file or folder');
      }
    }
    catch (error){
      return response.fetchResponse(error, false);
    }
  },

      updateGroup(groupId: string, newGroup: Group): R {
          try {
              if ( !this.userId ) {
                  throw new Meteor.Error('User is not logged.');
              }

              const result = GroupsCollection.collection.update(groupId, {$set: newGroup});
              if (result) {
                  return response.fetchResponse(result);
              } else {
                  throw new Meteor.Error('Unable to create file or folder');
              }
          }
          catch (error){
              return response.fetchResponse(error, false);
          }

      },

    addMember(user: User, groupId: string): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const group: Group = GroupsCollection.collection.findOne({ _id: { $eq: groupId}});

            if ( !util.valueExist(group) ) {
                throw new Meteor.Error('Group does not exist');
            } else if ( isUserInGroup(user, group)) {
                throw new Meteor.Error('User already exist in a group');
            }

            const member = castUserToMember(user);
            let updatedMembers: Member[] = group.members;
            updatedMembers.push(member);

            const updated = GroupsCollection.collection.update(group._id, {$set: {members: updatedMembers}});
            if ( updated ) {
                return response.fetchResponse(updatedMembers);
            } else {
                throw new Meteor.Error('Unable to add member in a group.');
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }

    },

    renameGroup(newName:string, groupId: string) {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const setValues = { 'name': newName };
            const group: Group = GroupsCollection.collection.findOne({ _id: { $eq: groupId}});
            if (!util.valueExist(group)) {
                throw new Meteor.Error('Group not found.');
            }

            const updated = GroupsCollection.collection.update(group._id, { $set: setValues });
            if ( updated ) {
                return response.fetchResponse();
            } else {
                throw new Meteor.Error('Unable to rename group.');
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    },

    removeGroup(groupId: string) {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }
            const updated = GroupsCollection.collection.remove(groupId);
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

    removeMember(user: User, groupId: string): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const group: Group = GroupsCollection.collection.findOne({ _id: { $eq: groupId}});

            if ( !util.valueExist(group) ) {
                throw new Meteor.Error('Group does not exist');
            } else if ( !isUserInGroup(user, group)) {
                throw new Meteor.Error('User is not in a group');
            }

            group.members.forEach((member, index) => {
              if (member.user._id === user._id) {
                group.members.splice(index, 1);
              }
            });

            const updated = GroupsCollection.collection.update(group._id, {$set: {members: group.members}});
            if ( updated ) {
                return response.fetchResponse(group.members);
            } else {
                throw new Meteor.Error('Unable to remove member in a group.');
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }

    },

    acceptMembership(groupId: string): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const group: Group = GroupsCollection.collection.findOne({ _id: { $eq: groupId}});

            if ( !util.valueExist(group) ) {
                throw new Meteor.Error('Group does not exist');
            } else if ( !isUserInGroup(Meteor.user(), group)) {
                throw new Meteor.Error('User is not in a group');
            }

            group.members.forEach(member => {
              if (member.user._id === this.userId) {
                member.requestStatus = RequestStatus.Accepted;
              }
            });

            const updated = GroupsCollection.collection.update(group._id, {$set: {members: group.members}});
            if ( updated ) {
                return response.fetchResponse(group.members);
            } else {
                throw new Meteor.Error('Unable to remove member in a group.');
            }
        }
        catch (error){
            return response.fetchResponse(error, false);
        }

    },

});
