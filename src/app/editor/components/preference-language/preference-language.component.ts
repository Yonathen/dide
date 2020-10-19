import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { PreferencesService } from 'src/app/preferences/services/preferences.service';
import { LanguageType, SettingLanguage } from 'api/server/models/setting-language';
import { SettingSolver } from 'api/server/models/setting-solver';
import { SettingExecutor } from 'api/server/models/setting-executor';
import { SettingPreference } from 'api/server/models/setting-preference';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-preference-language',
  templateUrl: './preference-language.component.html',
  styleUrls: ['./preference-language.component.scss']
})
export class PreferenceLanguageComponent implements OnInit {


  public languageOpt: SelectItem[] = [];
  public solverOpt: SelectItem[] = [];
  public executorOpt: SelectItem[] = [];

  public optionValues: string = '';
  public optionsTableColumns: any [];
  public preference: SettingPreference;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private preferenceService: PreferencesService,
    private accountService: AccountService) { }

  ngOnInit(): void {

    this.loadLanguages();
    this.loadSolvers();
    this.loadExecutors();

    this.optionsTableColumns = [
      { field: 'options', header: 'preference.options' }
    ];

    this.accountService.preference.subscribe(value => {
      this.preference = value;
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
          }
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

  addOptionValues() {
    this.preference.other.push({ options: this.optionValues });
    this.optionValues = '';
  }

}
