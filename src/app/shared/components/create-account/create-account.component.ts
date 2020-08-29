import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserAccount } from 'api/server/models/user-account';
import { UserType, AccountStatus } from 'api/server/models/user';
import { util } from 'api/server/lib/util';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit, OnDestroy {

  public submitted: boolean;
  public createAccountForm: FormGroup;
  public failedMessage: string;
  @Output('cancel') cancelEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private accountService: AccountService,
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
    this.createAccountForm = this.formBuilder.group({
      firstName: [ {value: null, disabled: false}, Validators.required ],
      lastName: [ {value: null, disabled: false}, Validators.required ],
      email: [ {value: null, disabled: false}, Validators.required ],
      password: [ {value: null, disabled: false}, Validators.required ]
    });
  }

  failedValidation(componentName: string) {
    return this.createAccountForm.get(componentName).invalid && this.submitted;
  }

  isFormInvalid(): boolean {
    return util.valueExist(this.failedMessage);
  }

  create() {
    this.submitted = true;
    if ( this.createAccountForm.valid ) {
      this.failedMessage = null;
      this.accountService.createAccount(this.createAccountForm.value).then((result) => {
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
