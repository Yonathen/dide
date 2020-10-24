

export enum LanguageType {
  Human, Programing
}

export interface SettingLanguage {
  _id?: string;
  label: string;
  value: string;
  type: LanguageType;
}
