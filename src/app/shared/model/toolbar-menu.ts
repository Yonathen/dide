import { LoideMenuItem } from './menu-item';

export interface LoideToolbarMenu {
    enableButtonMenu?: boolean;
    enableSearch?: boolean;
    enableSort?: boolean;
    enableViewChange?: boolean;
    buttonMenu?: LoideMenuItem[]
    searchPlaceholderIndex?: string;
}
  