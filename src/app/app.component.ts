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
import {HttpClient} from '@angular/common/http';
import {EtsConfigService} from './EtsConfigService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  private mDestroy = new Subject();

  mModel: any = {}; // data used for authenticating
  mUser: EtsAuthService.User = null;
  mUserString: string = '';
  mAuthenticating: boolean = false;
  mErrorStatus: string = null;
  mErrorMessage: string = null;
  mServicesString: string = '';

  constructor(private mAuthService: EtsAuthService, private mHttp: HttpClient, private mConfig: EtsConfigService) {
    mAuthService.user().pipe(takeUntil(this.mDestroy)).subscribe(user => {
      this.mUser = user;
      this.mUserString = this.json2string(user);
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

  private json2string(value: any): string {
    return JSON.stringify(value, null, 2)
      .replace(new RegExp(' ', 'g'), '&nbsp;')
      .replace(new RegExp('\n', 'g'), '<br/>');
  }

  showComponents() {
    this.mHttp.get('/' + this.mConfig.KnowledgeHubRegistryApiUrl + '/api/v1/service').subscribe(s => {
      this.mServicesString = this.json2string(s);
    });
  }

  ngOnDestroy() {
    this.mDestroy.next();
  }

}
