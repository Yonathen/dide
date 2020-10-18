import { SettingExecutor } from './setting-executor';
import { SettingTheme } from './setting-theme';
import { SettingSolver } from './setting-solver';
import { User, UserType } from './user';
import { SettingLanguage } from './setting-language';

export enum SettingTypes {
    Solver, Theme, State, Language
}

export interface SettingPreference{
  _id?: string;
  theme: SettingTheme;
  solver: SettingSolver;
  language: SettingLanguage;
  programingLanguage: SettingLanguage;
  executor: SettingExecutor;
  other?: any[];
  user?: User;
  userType: UserType;
}
