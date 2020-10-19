import { SettingExecutor } from './setting-executor';
import { SettingTheme } from './setting-theme';
import { SettingSolver } from './setting-solver';
import { User, UserType } from './user';
import { SettingLanguage } from './setting-language';
import { PreferenceOptions } from './preference-options';

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
  other?: PreferenceOptions[];
  user?: User;
  userType: UserType;
}



export function castToSettingPreference(
  language: SettingLanguage,
  programingLanguage: SettingLanguage,
  solver: SettingSolver,
  theme: SettingTheme,
  executor: SettingExecutor,
  other: PreferenceOptions[] = [],
  userType: UserType = UserType.Member): SettingPreference {
  return {
    language,
    programingLanguage,
    solver,
    theme,
    executor,
    other,
    userType
  } as SettingPreference;
}
