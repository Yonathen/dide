
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { PreferencesService } from 'src/app/preferences/services/preferences.service';
import { LanguageType, SettingLanguage } from 'api/server/models/setting-language';
import { SettingSolver } from 'api/server/models/setting-solver';
import { SettingExecutor } from 'api/server/models/setting-executor';
import { SettingPreference } from 'api/server/models/setting-preference';
import { AccountService } from 'src/app/shared/services/account.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-preference-language',
  templateUrl: './preference-language.component.html',
  styleUrls: ['./preference-language.component.scss']
})
export class PreferenceLanguageComponent implements OnInit {

  public visible: boolean;
  public languageOpt: SelectItem[] = [];
  public solverOpt: SelectItem[] = [];
  public executorOpt: SelectItem[] = [];

  public optionValues: string = '';
  public optionsTableColumns: any [];
  public preference: SettingPreference;
  public savedPreference: SettingPreference;

  public updatePreferenceForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private preferenceService: PreferencesService,
    private accountService: AccountService) { }

  ngOnInit(): void {

    this.loadLanguages();

    this.optionsTableColumns = [
      { field: 'options', header: 'preference.options' }
    ];

    this.accountService.preference.subscribe(value => {
      this.preference = value;
      this.savedPreference = _.clone(value);
    });
  }

  setUpForm() {
    this.updatePreferenceForm = this.formBuilder.group({
      executor: [ {value: this.preference.executor, disabled: false}, Validators.required ],
      language: [ {value: this.preference.programingLanguage, disabled: false}, Validators.required ],
      solver: [ {value: this.preference.solver, disabled: false}, Validators.required ]
    });
    this.visible = true;
  }

  loadLanguages() {
    this.preferenceService.getSettings('getLanguages').then(R => {
      if ( R.success ) {
        const languages: SettingLanguage[] = R.returnValue;
        languages.forEach(language => {
          const item: SelectItem = { label: language.label, value: language };
          if (language.type === LanguageType.Programing) {
            this.languageOpt.push(item);
          }
        });
      }
      this.loadSolvers();
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
      this.loadExecutors();
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
      this.setUpForm();
    });

  }

  onChangeOption(event, prop: string) {
    switch ( prop ) {
      case 'language':
        this.preference.programingLanguage = event.value;
        break;
      case 'solver':
        this.preference.solver = event.value;
        break;
      case 'executor':
        this.preference.executor = event.value;
    }
  }

  addOptionValues() {
    this.preference.other.push({ options: this.optionValues });
    this.optionValues = '';
  }

  isVisible(): boolean {
    return this.visible;
  }

  isChanged(): boolean {
    if ( this.preference.language._id !== this.savedPreference.language._id ) {
      return true;
    } else if ( this.preference.solver._id !== this.savedPreference.solver._id ) {
      return true;
    } else if ( this.preference.executor._id !== this.savedPreference.executor._id ) {
      return true;
    } else if ( this.preference.other.length !== this.savedPreference.other.length ) {
      return true;
    } else {
      for ( let opt of this.preference.other ) {
        const indexOpt = this.savedPreference.other.findIndex( value => value.options === opt.options );
        if ( indexOpt < 0 ) {
          return true;
        }
      }
    }
  }

  reset() {
    this.visible = false;
    this.accountService.getUserPreferences().then(R => {
      if ( R.success ) {
        this.setUpForm();
      }
      this.visible = true;
    });
  }

}
