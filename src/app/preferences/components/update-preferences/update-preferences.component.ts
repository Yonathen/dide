import { SettingSolver } from './../../../../../api/server/models/setting-solver';

import { AccountService } from 'src/app/shared/services/account.service';
import { SelectItem } from 'primeng/api/selectitem';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PreferencesService } from '../../services/preferences.service';
import { SettingLanguage, LanguageType } from 'api/server/models/setting-language';
import { SettingTheme } from 'api/server/models/setting-theme';

@Component({
  selector: 'app-update-preferences',
  templateUrl: './update-preferences.component.html',
  styleUrls: ['./update-preferences.component.scss']
})
export class UpdatePreferencesComponent implements OnInit {
  @Input() visible: boolean;

  public submitted: boolean;
  public failedMessage: string;
  public updatePreferenceForm: FormGroup;

  public themeOpt: SelectItem[];
  public solverOpt: SelectItem[];
  public executorOpt: SelectItem[];
  public languageOpt: SelectItem[];
  public computerLanguageOpt: SelectItem[];

  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  private _subscriptions = new Subscription();

  constructor(
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private preferenceService: PreferencesService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadLanguages();
    this.loadThemes();
    this.loadSolvers();
    this.loadExecutors();
  }

  loadLanguages() {
    this.preferenceService.getSettings('getLanguages').then(R => {
      if ( R.success ) {
        const languages: SettingLanguage[] = R.returnValue;
        languages.forEach(language => {
          const item: SelectItem = { label: language.label, value: language };
          if (language.type === LanguageType.Human) {
            this.languageOpt.push(item);
          } else if ( language.type === LanguageType.Programing ) {
            this.computerLanguageOpt.push(item);
          }
        });
      }
    });
  }

  loadThemes() {
    this.preferenceService.getSettings('getThemes').then(R => {
      if ( R.success ) {
        const themes: SettingTheme[] = R.returnValue;
        themes.forEach(theme => {
          const item: SelectItem = { label: theme.name, value: theme };
          this.themeOpt.push(item);
        });
      }
    });
  }

  loadSolvers() {
    this.preferenceService.getSettings('getSolvers').then(R => {
      if ( R.success ) {
        const solvers: SettingSolver[] = R.returnValue;
        solvers.forEach(solver => {
          const item: SelectItem = { label: solver.label, value: solver };
          this.themeOpt.push(item);
        });
      }
    });
  }

  loadExecutors() {
    this.preferenceService.getSettings('getExecutors').then(R => {
      if ( R.success ) {
        const solvers: SettingSolver[] = R.returnValue;
        solvers.forEach(solver => {
          const item: SelectItem = { label: solver.label, value: solver };
          this.themeOpt.push(item);
        });
      }
    });

  }


}
