import { Meteor } from 'meteor/meteor';
import { response, R } from '../lib/response';
import { util } from '../lib/util';
import { Member } from '../models/group';
import { SettingTheme } from '../models/setting-theme';
import { SettingLanguage } from '../models/setting-language';
import { SettingSolver } from '../models/setting-solver';
import { SettingSolversCollection } from '../collections/setting-solvers-collection';
import { SettingLanguagesCollection } from '../collections/setting-languages-collection';
import { SettingThemesCollection } from '../collections/setting-themes-collection';
import { SettingTypes } from '../models/setting-preference';

Meteor.methods({
    defineSolver(solver: SettingSolver): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }
            
            const result: string = SettingSolversCollection.collection.insert(solver);
            if (result) {
                return response.fetchResponse();
            } else {
                throw new Meteor.Error("Unable to create solver")
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }

    },


    defineLanguage(language: SettingLanguage): R {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }
            
            const result: string = SettingLanguagesCollection.collection.insert(language);
            if (result) {
                return response.fetchResponse();
            } else {
                throw new Meteor.Error("Unable to create language")
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }

    },

    defineTheme(theme: SettingTheme) {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }
            
            const result: string = SettingThemesCollection.collection.insert(theme);
            if (result) {
                return response.fetchResponse();
            } else {
                throw new Meteor.Error("Unable to create theme")
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    },

    removeSetting(type: SettingTypes, settingId: string) {
        try {
            if ( !this.userId ) {
                throw new Meteor.Error('User is not logged.');
            }
            
            let result: number = null;
            switch (type) {
                case SettingTypes.Language:
                    result = SettingLanguagesCollection.collection.remove(settingId);
                break;
                case SettingTypes.Theme:
                    result = SettingThemesCollection.collection.remove(settingId);
                break;
                case SettingTypes.Solver:
                    result = SettingSolversCollection.collection.remove(settingId);
                break;
                case SettingTypes.State:
                    
                break;
            }
            
            if (result) {
                return response.fetchResponse();
            } else {
                throw new Meteor.Error("Unable to create theme")
            }
        }
        catch(error){
            return response.fetchResponse(error, false);
        }
    }
    
})