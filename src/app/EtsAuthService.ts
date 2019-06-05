/**
 * @license
 * Copyright (c) 2019 Molecular Networks GmbH. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be found in the root folder of this repository.
 *
 * @author Jörg Marusczyk <joerg.marusczyk@mn-am.com>
 */

// rxjs
import {Observable, BehaviorSubject, Subject, timer} from 'rxjs';
import {filter, map, share, takeUntil} from 'rxjs/operators';

// angular
import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

//
import {EtsJwt} from './EtsJwt';
import {EtsConfigService} from './EtsConfigService';

@Injectable({
  providedIn: 'root',
})
export class EtsAuthService {

  static LocalStorageKey = 'ets-webapp';
  static Token: BehaviorSubject<string> = new BehaviorSubject(null);
  static Logout: Subject<any> = new Subject();
  static Counter: number = 0;

  private NoUser = new EtsAuthService.User();
  private mAuthenticating: Observable<any> = null;
  private mUserChange: BehaviorSubject<EtsAuthService.User> = new BehaviorSubject(null);
  private mDestroyRefresh: Subject<any> = new Subject();
  private mConfiguration: EtsConfigService;

  constructor(injector: Injector, private mHttp: HttpClient) {

    /*console.log(EtsJwt.decodeTokenHeader(sample));
    console.log(EtsJwt.decodeTokenPayload(sample));
    console.log(EtsJwt.getTokenExpirationDate(sample));
    console.log(EtsJwt.isTokenExpired(sample));
    console.log(EtsJwt.isTokenValid(sample));
    console.log(EtsJwt.getTokenExpiresInMilliseconds(sample));


    //const isValid = KJUR.jws.JWS.verifyJWT(sample, pem, EtsJwt.decodeTokenHeader(sample));
    const isValid = KJUR.jws.JWS.verifyJWT(sample, pem, {alg:["RS256"]});
    console.log(isValid);*/


    this.mConfiguration = injector.get(EtsConfigService);
    console.log('created EtsAuthService');

    // check localstorage for token
    const token = this.readToken();
    console.log('User token from localstorage:', token);

    this.tokenToUser(token);

    // try to get user information for current user with token
    /*this.mHttp.get(EtsAuthService.UserUrl).subscribe((user: any) => {
        console.log('Loaded user data on startup:', user);
        this.update(
            new EtsAuthService.User(
                token,
                true,
                user.username,
                user.first_name,
                user.last_name,
                user.email,
                user.is_superuser,
                user.user_permissions,
                ms_token
            )
        );
    }, error => {
        console.log('Error while loading user data on startup:', error);
        this.reset();
    });*/
  }

  private tokenToUser(token: string) {
    // check if the token has expired
    console.log('XXXXXXXXXXXz', token);
    if (!EtsJwt.isTokenValid(token)) {
      console.log('User token invalid');
      console.log(EtsJwt.decodeTokenHeader(token));
      console.log(EtsJwt.decodeTokenPayload(token));
      console.log(EtsJwt.getTokenExpirationDate(token));
      console.log(EtsJwt.isTokenExpired(token));
      // console.log(EtsJwt.isTokenValid(token));
      console.log(EtsJwt.getTokenExpiresInMilliseconds(token));
      this.reset();
      return;
    }

    // check token expiration
    console.log('User token will expire in milliseconds from now', EtsJwt.getTokenExpiresInMilliseconds(token));
    if (EtsJwt.getTokenExpiresInMilliseconds(token) < 100000) {
      console.log('User token will expire in less than 100 seconds, user has to login again');
      this.reset();
      return;
    }

    // update user
    const token_payload: EtsJwt.Token.Payload = EtsJwt.decodeTokenPayload(token);
    this.update(
      new EtsAuthService.User(
        token,
        true,
        token_payload.sub,
        token_payload.roles,
      )
    );
  }

  private reset() {
    this.writeToken();
    EtsAuthService.Token.next('');
    this.mDestroyRefresh.next();
    this.mUserChange.next(this.NoUser);
  }

  private update(user: EtsAuthService.User) {
    this.writeToken(user.token);
    EtsAuthService.Token.next(user.token);
    this.refresh(user);
    this.mUserChange.next(user);
  }

  private refresh(user: EtsAuthService.User) {
    // set a timer that refreshes before the token expires
    this.mDestroyRefresh.next();
    const refresh: number = EtsJwt.getTokenExpiresInMilliseconds(user.token) - 60000;
    // const refresh: number = user.expires - Date.now() - 50000;
    console.log('User token will be refreshed ms from now:', refresh);
    timer(0, 30000).pipe(takeUntil(this.mDestroyRefresh)).subscribe(val => {
      const lot = EtsJwt.getTokenExpiresInMilliseconds(user.token);
      console.log('Logout Timer', lot);
      if (lot < 60000 /*1820294*/) {
        console.log('Token expired, sending logout signal');
        EtsAuthService.Logout.next();
        this.reset();
      }
      /*console.log('Token expired, sending logout signal');
      EtsAuthService.Logout.next();
      this.reset();*/

      /*const body = JSON.stringify({token: user.token});
      this.mHttp.post(EtsAuthService.RefreshUrl, body).pipe(takeUntil(this.mDestroyRefresh)).subscribe((data: any) => {
          console.log('User token has been refreshed');
          EtsAuthService.Token.next(data.token);
          const refreshed_user: EtsAuthService.User = this.mUserChange.getValue();
          refreshed_user.token = data.token;
          refreshed_user.expires = this.mJwtHelper.getTokenExpirationDate(data.token).valueOf();
          this.refresh(refreshed_user);
      }, error => {
          console.log('User token could not be refreshed:', error);
          this.reset();
      });*/
    });
  }

  private readToken(): string {
    return localStorage.getItem(EtsAuthService.LocalStorageKey);
  }

  private writeToken(token: string = null) {
    if (token === null) {
      localStorage.removeItem(EtsAuthService.LocalStorageKey);
    } else {
      localStorage.setItem(EtsAuthService.LocalStorageKey, token);
    }
  }

  public user(): Observable<EtsAuthService.User> {
    return this.mUserChange.pipe(filter(v => v !== null));
  }

  public token(): Observable<string> {
    return EtsAuthService.Token;
  }

  public login(username: string, password: string): Observable<any> {

    this.mDestroyRefresh.next();
    if (this.mAuthenticating !== null) {
      return;
    }

    const body = {username: username, password: password};
    // const headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    // const headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    const options: any = {responseType: 'text'};
    const url = this.mConfiguration.GatewayUrl + this.mConfiguration.AuthenticationApiUrl;
    this.mAuthenticating = this.mHttp.post(url, body, options).pipe(share());
    this.mAuthenticating.subscribe(
      (token: string) => {
        console.log(token);
        this.tokenToUser(token);
        this.mAuthenticating = null;
      },
      err => {
        console.error(err);
        this.reset();
        this.mAuthenticating = null;
      },
      () => {
        console.log('User authentication complete');
      }
    );
    return this.mAuthenticating;
  }

  public logout() {
    this.reset();
  }


}

export namespace EtsAuthService {
  export class User {
    constructor(
      public token: string = '',
      public authenticated: boolean = false,
      public username: string = '',
      public roles: string[] = []
    ) {
    }
  }
}

