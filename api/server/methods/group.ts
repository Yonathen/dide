import { Meteor } from 'meteor/meteor';
import { response, R } from '../lib/response';
import { util } from '../lib/util';
import { Member, Group, castUserToMember, isUserInGroup } from '../models/group';
import { GroupsCollection } from '../collections/groups-collection';
import { User } from '../models/user';

Meteor.methods({

    createGroup(newGroup: Group): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }
            
            const result: string = GroupsCollection.collection.insert(newGroup);
            if (result) {
                return response.fetchResponse();
            } else {
                throw new Meteor.Error("Unable to create file or folder")
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }

    },

    addMember(user: User, groupId: string): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const group: Group = GroupsCollection.collection.findOne({ '_id': { $eq: groupId}});
            
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

    removeMember(user: User, groupId: string): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const group: Group = GroupsCollection.collection.findOne({ '_id': { $eq: groupId}});
            
            if ( !util.valueExist(group) ) {
                throw new Meteor.Error('Group does not exist');
            } else if ( !isUserInGroup(user, group)) {
                throw new Meteor.Error('User is not in a group');
            }

            const memberIndex = group.members.findIndex(member => member.user._id === user._id);
            let updatedMembers: Member[] = group.members.splice(memberIndex, 1);

            const updated = GroupsCollection.collection.update(group._id, {$set: {members: updatedMembers}});
            if ( updated ) {
                return response.fetchResponse(updatedMembers);
            } else {
                throw new Meteor.Error('Unable to remove member in a group.');
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }

    },
    
})