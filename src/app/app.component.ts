/**
 * @license
 * Copyright (c) 2019 Molecular Networks GmbH. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be found in the root folder of this repository.
 *
 * @author Jörg Marusczyk <joerg.marusczyk@mn-am.com>
 */

// rxjs
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

// angular
import {Component, OnDestroy} from '@angular/core';

//
import {EtsAuthService} from './EtsAuthService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  private mDestroy = new Subject();
  private mUser: EtsAuthService.User = null;
  private mAuthenticating: boolean = false;
  private mErrorStatus: string = null;
  private mErrorMessage: string = null;

  mModel: any = {}; // data used for authenticating

  constructor(private mAuthService: EtsAuthService) {
    mAuthService.user().pipe(takeUntil(this.mDestroy)).subscribe(user => {
      this.mUser = user;
    });
  }

  /**
   * Login user with provided credentials
   */
  public login(username: string, password: string) {
    if (this.mAuthenticating) {
      return;
    }
    this.mAuthenticating = true;
    this.mAuthService.login(username, password)
      .subscribe(
        data => {
          this.mAuthenticating = false;
          this.mErrorStatus = null;
          this.mErrorMessage = null;
          console.log('Authentication Success');
        },
        err => {
          console.log(err);
          this.mErrorStatus = err.status;
          this.mErrorMessage = err.error;
          this.mAuthenticating = false;
          console.log('Authentication Error', err);
        });
  }

  /**
   * Logout the user
   */
  logout() {
    this.mAuthService.logout();
  }

  ngOnDestroy() {
    this.mDestroy.next();
  }

}
