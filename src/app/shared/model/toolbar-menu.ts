import { DideMenuItem } from './menu-item';

export interface DideToolbarMenu {
    enableButtonMenu?: boolean;
    enableSearch?: boolean;
    enableSort?: boolean;
    enableViewChange?: boolean;
    buttonMenu?: DideMenuItem[]
    searchPlaceholderIndex?: string;
}
  