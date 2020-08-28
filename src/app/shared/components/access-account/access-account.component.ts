import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { util } from 'api/server/lib/util';

@Component({
  selector: 'app-access-account',
  templateUrl: './access-account.component.html',
  styleUrls: ['./access-account.component.scss']
})
export class AccessAccountComponent implements OnInit {

  public submitted: boolean;
  public accessAccount: FormGroup;
  public failedMessage: string;
  @Output('cancel') cancelEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private accountService: AccountService, 
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.submitted = false;
    this.failedMessage = null;
    this.setUpForm();
  }

  
  ngOnDestroy() {
    this.setUpForm();
  }


  setUpForm() {
    this.accessAccount = this.formBuilder.group({
      email: [ {value: null, disabled: false}, Validators.required ],
      password: [ {value: null, disabled: false}, Validators.required ]
    });
  }

  failedValidation(componentName: string) {
    return this.accessAccount.get(componentName).invalid && this.submitted;
  }

  isFormInvalid(): boolean {
    return util.valueExist(this.failedMessage);
  }

  create() {
    this.submitted = true;
    if ( this.accessAccount.valid ) {
      this.failedMessage = null;
      this.accountService.accessAccount(this.accessAccount.value).then((result) => {
        if ( result.success ) {
          this.cancel(true);
        } else {
          if ( result.errorValue && result.errorValue.message ) {
            this.failedMessage = result.errorValue.message
          } else {
            this.failedMessage = "Unknown error"
          }
        }
      });

    }
  }


  cancel(created: boolean = false) {
    this.setUpForm();
    this.submitted = false;
    this.failedMessage = null;
    this.cancelEmitter.emit(created);
  }
}
