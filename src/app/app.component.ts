import { Component, OnInit } from '@angular/core';
import { R } from 'api/server/lib/response-service';
import { UserAccount } from 'api/server/models/user-account';
import { UserType, AccountStatus } from 'api/server/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'loide';

  ngOnInit() {
    let data: UserAccount = {
      email: 'tst3@gmail.com',
      password: 'tst135',
      profile: {
        firstName: 'Jhon',
        lastName: 'Doe',
        type: UserType.Member,
        notifications: [],
        status: AccountStatus.Active
      }
    }

    Meteor.call('createAccount', data, (error, result: R) => {
      if (result && result.success) {
        console.log(result);
      } else if (result && !result.success) {
        console.warn(result);
      } else if (error) {
        console.error(error);
      }
    });
  }
}
