import { SettingExecutor } from './../../../../../api/server/models/setting-executor';
import { SettingSolver } from './../../../../../api/server/models/setting-solver';

import { AccountService } from 'src/app/shared/services/account.service';
import { SelectItem } from 'primeng/api/selectitem';
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PreferencesService } from '../../services/preferences.service';
import { SettingLanguage, LanguageType } from 'api/server/models/setting-language';
import { SettingTheme } from 'api/server/models/setting-theme';
import { SettingPreference } from 'api/server/models/setting-preference';
import { util } from 'api/server/lib/util';
import * as _ from 'lodash';
import { PreferenceOptions } from 'api/server/models/preference-options';

@Component({
  selector: 'app-update-preferences',
  templateUrl: './update-preferences.component.html',
  styleUrls: ['./update-preferences.component.scss']
})
export class UpdatePreferencesComponent implements OnInit, OnChanges {
  @Input() visible: boolean;

  public submitted: boolean;
  public failedMessage: string;
  public preference: SettingPreference;
  public updatePreferenceForm: FormGroup;

  public themeOpt: SelectItem[] = [];
  public solverOpt: SelectItem[] = [];

  public executorOpt: SelectItem[] = [];
  public languageOpt: SelectItem[] = [];
  public computerLanguageOpt: SelectItem[] = [];

  public optionValues: string = '';
  public optionsTableColumns: any [];
  public preferenceOptions: PreferenceOptions[] = [];

  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

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

    this.accountService.preference.subscribe(value => {
      this.preference = _.clone(value);
    });

    this.optionsTableColumns = [
      { field: 'options', header: 'preference.options' }
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes.visible && this.visible ) {
      this.submitted = false;
      this.failedMessage = null;
      this.setUpForm();
    }
  }

  addOptionValues() {
    this.preferenceOptions.push({ options: this.optionValues });
    this.optionValues = '';
  }

  setUpForm() {
    this.updatePreferenceForm = this.formBuilder.group({
      executor: [ {value: this.preference.executor, disabled: false}, Validators.required ],
      language: [ {value: this.preference.language, disabled: false}, Validators.required ],
      programingLanguage: [ {value: this.preference.programingLanguage, disabled: false}, Validators.required ],
      solver: [ {value: this.preference.solver, disabled: false}, Validators.required ],
      theme: [ {value: this.preference.theme, disabled: false}, Validators.required ]
    });
  }

  setPreferenceOptionsTable() {
    this.preferenceOptions.splice(0, this.preferenceOptions.length);
    this.preference.other.forEach(option => {
      this.preferenceOptions.push(option);
    });
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
          this.solverOpt.push(item);
        });
      }
    });
  }

  loadExecutors() {
    this.preferenceService.getSettings('getExecutors').then(R => {
      if ( R.success ) {
        const executors: SettingExecutor[] = R.returnValue;
        executors.forEach(executor => {
          const item: SelectItem = { label: executor.label, value: executor };
          this.executorOpt.push(item);
        });
      }
    });

  }

  failedValidation(componentName: string, options: any[]) {

    return this.updatePreferenceForm.get(componentName).invalid && this.submitted;
  }

  isFormInvalid(): boolean {
    return util.valueExist(this.failedMessage);
  }

  update() {
    this.submitted = true;
    if ( this.updatePreferenceForm.valid ) {
      this.failedMessage = null;
      this.preferenceService.updatePreference(this.updatePreferenceForm.value, this.preferenceOptions).then( result => {
        if ( result.success ) {
          const updatedPreference: SettingPreference = result.returnValue;
          this.accountService.setPreference(updatedPreference);
          this.close();
        } else {
          if ( result.errorValue && result.errorValue.message ) {
            this.failedMessage = result.errorValue.message;
          } else {
            this.failedMessage = 'Unknown error';
          }
        }
      });
    }
  }

  close() {
    this.setUpForm();
    this.submitted = false;
    this.failedMessage = null;
    this.cancel.emit();
  }


}
