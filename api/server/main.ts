import { SettingSolver } from './models/setting-solver';
import { SettingExecutor } from './models/setting-executor';
import { Meteor } from 'meteor/meteor';
import { SettingLanguagesCollection } from './collections/setting-languages-collection';
import { SettingThemesCollection } from './collections/setting-themes-collection';
import { SettingSolversCollection } from './collections/setting-solvers-collection';
import { SettingExecutorCollection } from './collections/setting-executor-collection';
import { SettingPreferencesCollection } from './collections/setting-preferences-collection';
import { SettingTheme } from './models/setting-theme';
import { SettingLanguage, LanguageType } from './models/setting-language';
import { UserType } from './models/user';
import { WebApp } from 'meteor/webapp';

WebApp.rawConnectHandlers.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
  return next();
});

Meteor.startup(() => {
/*
  SettingLanguagesCollection.collection.remove({});
  SettingThemesCollection.collection.remove({});
  SettingExecutorCollection.collection.remove({});
  SettingSolversCollection.collection.remove({});
  SettingPreferencesCollection.collection.remove({ userType : UserType.Default });

  SettingLanguagesCollection.collection.insert({label: 'ASP', value: 'asp', type: LanguageType.Programing});
  SettingLanguagesCollection.collection.insert({label: 'Italian', value: 'it', type: LanguageType.Human});
  SettingLanguagesCollection.collection.insert({label: 'English', value: 'en', type: LanguageType.Human});

  SettingSolversCollection.collection.insert({label: 'DLV2', value: 'dlv2'});
  SettingSolversCollection.collection.insert({label: 'Clingo', value: 'clingo'});
  SettingSolversCollection.collection.insert({label: 'DLV', value: 'dlv'});

  SettingExecutorCollection.collection.insert({label: 'EmbASPServerExecutor', value: 'embAspServerExecutor'});

  SettingThemesCollection.collection.insert({name: 'ambiance'});
  SettingThemesCollection.collection.insert({name: 'chaos'});
  SettingThemesCollection.collection.insert({name: 'chrome'});
  SettingThemesCollection.collection.insert({name: 'dawn'});
  SettingThemesCollection.collection.insert({name: 'dracula'});
  SettingThemesCollection.collection.insert({name: 'dreamweaver'});
  SettingThemesCollection.collection.insert({name: 'eclipse'});
  SettingThemesCollection.collection.insert({name: 'github'});
  SettingThemesCollection.collection.insert({name: 'gob'});
  SettingThemesCollection.collection.insert({name: 'iplastic'});
  SettingThemesCollection.collection.insert({name: 'merbivore_soft'});
  SettingThemesCollection.collection.insert({name: 'mono_industrial'});
  SettingThemesCollection.collection.insert({name: 'monokai'});
  SettingThemesCollection.collection.insert({name: 'nord_dark'});
  SettingThemesCollection.collection.insert({name: 'solarized_dark'});
  SettingThemesCollection.collection.insert({name: 'textmate'});
  SettingThemesCollection.collection.insert({name: 'tomorrow'});
  SettingThemesCollection.collection.insert({name: 'tomorrow_night'});
  SettingThemesCollection.collection.insert({name: 'tomorrow_night_blue'});
  SettingThemesCollection.collection.insert({name: 'tomorrow_night_bright'});
  SettingThemesCollection.collection.insert({name: 'tomorrow_night_eighties'});
  SettingThemesCollection.collection.insert({name: 'twilight'});
  SettingThemesCollection.collection.insert({name: 'twilight'});
  SettingThemesCollection.collection.insert({name: 'vibrant_ink'});
  SettingThemesCollection.collection.insert({name: 'vibrant_ink'});
  SettingThemesCollection.collection.insert({name: 'xcode'});

  const defaultTheme: SettingTheme = SettingThemesCollection.collection.findOne({name: 'monokai'});
  const defaultProgramingLanguage: SettingLanguage = SettingLanguagesCollection.collection.findOne({value: 'asp'});
  const defaultLanguage: SettingLanguage = SettingLanguagesCollection.collection.findOne({value: 'en'});
  const defaultSolver: SettingSolver = SettingSolversCollection.collection.findOne({ value: 'dlv2' });
  const defaultExecutor: SettingExecutor = SettingExecutorCollection.collection.findOne({value: 'embAspServerExecutor'});
  SettingPreferencesCollection.collection.insert({
    theme: defaultTheme,
    language: defaultLanguage,
    programingLanguage: defaultProgramingLanguage,
    solver: defaultSolver,
    executor: defaultExecutor,
    userType: UserType.Default,
    other: []
  });
*/


});
