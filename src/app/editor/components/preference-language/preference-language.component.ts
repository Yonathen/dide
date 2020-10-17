import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';

interface OptionsTableValue {
  options: string;
}

@Component({
  selector: 'app-preference-language',
  templateUrl: './preference-language.component.html',
  styleUrls: ['./preference-language.component.scss']
})
export class PreferenceLanguageComponent implements OnInit {


  public languageOpt: SelectItem[];
  public solverOpt: SelectItem[];
  public executorOpt: SelectItem[];

  public optionValues: string = '';
  public optionsTableColumns: any [];
  public optionsTableValues: OptionsTableValue[] = [];

  constructor() { }

  ngOnInit(): void {

    this.languageOpt = [
      { label: 'ASP', value: 'asp' }
    ];

    this.solverOpt = [
      { label: 'DLV2', value: 'dlv2' },
      { label: 'Clingo', value: 'clingo' },
      { label: 'DLV', value: 'dlv' }
    ];

    this.executorOpt = [
      { label: 'embAspServerExecutor', value: 'EmbASPServerExecutor' }
    ];

    this.optionsTableColumns = [
      { field: 'options', header: 'preference.options' }
    ];
  }

  addOptionValues() {
    this.optionsTableValues.push({ options: this.optionValues });
    this.optionValues = '';
  }

}
