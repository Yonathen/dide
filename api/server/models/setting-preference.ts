import { SettingState } from './setting-state';
import { SettingTheme } from './setting-theme';
import { SettingSolver } from './setting-solver';
import { Editor } from './editor';
import { User } from './user';
import { SettingLanguage } from './setting-language';

export enum SettingTypes {
    Solver, Theme, State, Language
}

export interface SettingPreference{
    solver: SettingSolver;
    SettingTheme: SettingTheme;
    state: SettingState;
    language: SettingLanguage;
    other: any[];
    user: User | string;
}
