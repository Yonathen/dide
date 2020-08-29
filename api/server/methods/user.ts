import { Meteor } from 'meteor/meteor';
import { UserAccount } from '../models/user-account';
import { response, R } from '../lib/response';
import { util } from '../lib/util';
import { Observable } from 'rxjs';
import { Profile } from '../models/user';
import { FileFoldersCollection } from '../collections/file-folders-collection';
import { GroupsCollection } from '../collections/groups-collection';
import { SettingPreferencesCollection } from '../collections/setting-preferences-collection';
import { NotificationsCollection } from '../collections/notifications-collection';
import { UsersCollection } from '../collections/users-collection';

Meteor.methods({

    createAccount(data: UserAccount): R {
        try {
            const result = Accounts.createUser(data);
            if(result){
                return response.fetchResponse(result);
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    },

    updateProfile(newProfile: Profile): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            Meteor.users.update(this.userId, {
                $set: {profile: newProfile}
            });
        }
        catch(error){
            return response.fetchResponse(error, false);
        }

        return response.fetchResponse();
    },


    updateEmail(newEmail: string): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const oldEmail = Meteor.user().emails[0].address;
            Accounts.addEmail(this.userId, newEmail);
            Accounts.removeEmail(this.userId, oldEmail);
        }
        catch(error){
            return response.fetchResponse(error, false);
        }

        return response.fetchResponse();
    },


    updatePassword(newPassword: string): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            Accounts.setPassword(this.userId, newPassword);
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
        return response.fetchResponse();
    },

    searchUser(keywords: string): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const notCurrentUser = { _id : { $ne: this.userId } };
            let result = UsersCollection.collection.find(notCurrentUser, { limit: 30}).fetch();
            if (keywords !== '') {
              result = [];
              const allUsers = UsersCollection.collection.find(notCurrentUser).fetch();
              allUsers.forEach(user => {

                if ( user.profile.firstName.search(keywords) > -1 ||
                  user.profile.lastName.search(keywords) > -1 ||
                  user.emails[0].address.search(keywords) > -1 ) {
                    result.push(user);
                  }
              });
            }

            if (util.valueExist(result)) {
                return response.fetchResponse(result);
            } else {
                throw new Meteor.Error('Unable to search a value');
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    },

    getUserFiles(): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const result = FileFoldersCollection.collection.find({ 'owner._id': { $eq: this.userId}}).fetch();
            if (util.valueExist(result)) {
                return response.fetchResponse(result);
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    },

    getUserGroups(): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const result = GroupsCollection.collection.find({ 'createdBy._id': { $eq: this.userId}}).fetch();
            if (util.valueExist(result)) {
                return response.fetchResponse(result);
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    },

    getUserPreferences(): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const result = SettingPreferencesCollection.collection.find({ 'user._id': { $eq: this.userId}});
            if (util.valueExist(result)) {
                return response.fetchResponse(result);
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    },

    getUserNotification(): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }

            const result = NotificationsCollection.collection.find({ 'user._id': { $eq: this.userId}}).fetch();
            if (util.valueExist(result)) {
                return response.fetchResponse(result);
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    },


})
