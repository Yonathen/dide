import { Meteor } from 'meteor/meteor';
import { response, R } from '../lib/response';
import { util } from '../lib/util';
import { SettingSolversCollection } from '../collections/setting-solvers-collection';
import { SettingTypes, SettingPreference } from '../models/setting-preference';
import { SettingPreferencesCollection } from '../collections/setting-preferences-collection';
import { SettingThemesCollection } from '../collections/setting-themes-collection';
import { SettingLanguagesCollection } from '../collections/setting-languages-collection';
import { SettingExecutorCollection } from '../collections/setting-executor-collection';

Meteor.methods({
  updatePreference(settingPreference: SettingPreference): R {
      try {
          if ( !util.valueExist(this.userId) ) {
              throw new Meteor.Error('User is not logged.');
          }
          const result = SettingPreferencesCollection.collection.update(this.userId,  {$set: settingPreference});
          if (result) {
            const userPreference = SettingPreferencesCollection.collection.findOne({ 'user._id': { $eq: this.userId}});
            return response.fetchResponse(userPreference);
          } else {
              throw new Meteor.Error('Unable to update preferences.');
          }
      }
      catch (error) {
          return response.fetchResponse(error, false);
      }

  },

  getSolvers(): R {
    try {
        if ( !util.valueExist(this.userId) ) {
            throw new Meteor.Error('User is not logged.');
        }
        const result = SettingSolversCollection.collection.find().fetch();
        if (result) {
          return response.fetchResponse(result);
        } else {
          throw new Meteor.Error('Unable to fetch solver');
        }
    }
    catch (error) {
        return response.fetchResponse(error, false);
    }

  },

  getThemes(): R {
    try {
        if ( !util.valueExist(this.userId) ) {
            throw new Meteor.Error('User is not logged.');
        }
        const result = SettingThemesCollection.collection.find().fetch();
        if (result) {
          return response.fetchResponse(result);
        } else {
          throw new Meteor.Error('Unable to fetch solver');
        }
    }
    catch (error) {
        return response.fetchResponse(error, false);
    }
  },

  getLanguages(): R {
    try {
        if ( !util.valueExist(this.userId) ) {
            throw new Meteor.Error('User is not logged.');
        }
        const result = SettingLanguagesCollection.collection.find().fetch();
        if (result) {
          return response.fetchResponse(result);
        } else {
          throw new Meteor.Error('Unable to fetch solver');
        }
    }
    catch (error) {
        return response.fetchResponse(error, false);
    }
  },

  getExecutors(): R {
    try {
        if ( !util.valueExist(this.userId) ) {
            throw new Meteor.Error('User is not logged.');
        }
        const result = SettingExecutorCollection.collection.find().fetch();
        if (result) {
          return response.fetchResponse(result);
        } else {
          throw new Meteor.Error('Unable to fetch solver');
        }
    }
    catch (error) {
        return response.fetchResponse(error, false);
    }
  }
});
