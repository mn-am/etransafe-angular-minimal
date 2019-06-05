/**
 * @license
 * Copyright (c) 2019 Molecular Networks GmbH. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be found in the root folder of this repository.
 *
 * @author Jörg Marusczyk <joerg.marusczyk@mn-am.com>
 */

// rxjs
import {Observable} from 'rxjs';
import {first, mergeMap} from 'rxjs/operators';

// angular
import {Inject, Injectable, InjectionToken, Injector, Optional, Provider} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

//
import {EtsConfigService} from './EtsConfigService';
import {EtsAuthService} from './EtsAuthService';

@Injectable()
export class EtsAuthInterceptor implements HttpInterceptor {

  static InjectionToken = new InjectionToken<string[]>('ets_auth_interceptor_token');

  static providers(api_auth_blacklist: string[] = []): Provider[] {
    return [
      {provide: HTTP_INTERCEPTORS, useClass: EtsAuthInterceptor, multi: true},
      {provide: EtsAuthInterceptor.InjectionToken, useValue: api_auth_blacklist},
    ];
  }

  private mConfigService: EtsConfigService;

  constructor(injector: Injector, @Inject(EtsAuthInterceptor.InjectionToken) @Optional() private mBlackList: string[] = []) {
    this.mConfigService = injector.get(EtsConfigService);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('/')) {
      return EtsAuthService.Token.pipe(
        first(token => token !== null),
        mergeMap(token => {
          req = req.clone({
            url: this.mConfigService.GatewayUrl + req.url,
            setHeaders: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          // console.log('Intercepted request async, changed to', req);
          return next.handle(req);
        })
      );
    } else {
      return next.handle(req);
    }
  }
}

