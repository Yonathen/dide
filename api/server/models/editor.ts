import { Compiler } from './compiler';
import { SettingSolver } from './setting-solver';
import { SettingTheme } from './setting-theme';
import { SettingState } from './setting-state';
import { User } from './user';

export interface Editor {
    compiler: Compiler;
    solver: SettingSolver;
    SettingTheme: SettingTheme;
    state: SettingState;
    other: any[];
    owner: User | string;

    /*
    getPreference(): any;
    setEditor(): any;
    maintainFile(): any;
    executeFile(): any;
    */
}