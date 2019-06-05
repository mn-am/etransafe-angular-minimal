/**
 * @license
 * Copyright (c) 2019 Molecular Networks GmbH. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be found in the root folder of this repository.
 *
 * @author Jörg Marusczyk <joerg.marusczyk@mn-am.com>
 */

// angular
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

//
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {EtsConfigService} from './EtsConfigService';
import {EtsAuthInterceptor} from './EtsAuthInterceptor';
import {EtsAuthService} from './EtsAuthService';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
    ...EtsConfigService.providers(environment),
    ...EtsAuthInterceptor.providers(),
    EtsAuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
