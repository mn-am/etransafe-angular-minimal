/**
 * @license
 * Copyright (c) 2019 Molecular Networks GmbH. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be found in the root folder of this repository.
 *
 * @author Jörg Marusczyk <joerg.marusczyk@mn-am.com>
 */

// rxjs
import {tap} from 'rxjs/operators';

// angular
import {APP_INITIALIZER, Inject, Injectable, InjectionToken, Optional, Provider} from '@angular/core';
import {HttpClient} from '@angular/common/http';

/**
 * Configuration interface for the eTRANSAFE environment variables
 */
export interface EtsConfiguration {
    Offline?: boolean;
    ProductionBuild?: boolean;
    Environment: EtsConfiguration.Environment;
    GatewayUrl: string;
    AuthenticationApiUrl: string;
    KnowledgeHubRegistryApiUrl: string;
}

export namespace EtsConfiguration {
    export enum Environment {
        Local = 'LOCAL',                // running in local development environment
        Development = 'DEVELOPMENT',    // running in the KnowledgeHub development environment
        Testing = 'TESTING',            // running in the KnowledgeHub testing environment
        Production = 'PRODUCTION'       // running in the KnowledgeHub production environment
    }
}

/**
 * Service that makes the configuration of the eTRANSAFE environment available to the web application
 */
@Injectable()
export class EtsConfigService implements EtsConfiguration {

    static ProductionBuildToken = new InjectionToken<string[]>('configuration_service_production_build_token');

    static AppInitializer = {
        provide: APP_INITIALIZER,
        useFactory: EtsConfigService.initialize,
        deps: [EtsConfigService],
        multi: true
    };

    static initialize(config_service: EtsConfigService) {
        return () => config_service.load();
    }

    static providers(environment: any): Provider[] {
        return [
            EtsConfigService,
            EtsConfigService.AppInitializer,
            { provide: EtsConfigService.ProductionBuildToken, useValue: environment.production ? true : false}
        ];
    }

    public Offline: boolean;
    public Environment: EtsConfiguration.Environment;
    public GatewayUrl: string;
    public AuthenticationApiUrl: string;
    public KnowledgeHubRegistryApiUrl: string;

    constructor(private http: HttpClient, @Inject(EtsConfigService.ProductionBuildToken) @Optional() public ProductionBuild: boolean) {
        // nothing to be done here
    }

    load(): Promise<EtsConfiguration> {
        return this.http.get<EtsConfiguration>('assets/ets_webapp_configuration.json').pipe(tap((result: EtsConfiguration) => {
            this.Offline = result.Offline ? true : false;
            this.Environment = this.ProductionBuild ? result.Environment : EtsConfiguration.Environment.Local;
            this.GatewayUrl = result.GatewayUrl;
            this.AuthenticationApiUrl = result.AuthenticationApiUrl;
            this.KnowledgeHubRegistryApiUrl = result.KnowledgeHubRegistryApiUrl;
            console.log(result, this);
        })).toPromise();
    }

}

