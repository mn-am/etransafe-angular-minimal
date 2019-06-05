export namespace Ets {

    export interface Software {
        /**
         * Software name.
         */
        name: string;
        /**
         * Software version
         */
        version?: string;
        /**
         * Software component description, free text.
         */
        description?: string;
        /**
         * Software provider.
         */
        provider?: string;
        /**
         * Software license definition, free text.
         */
        license?: Array<License>;
    }

    /**
     * Licensing information.
     */
    export interface License {
        /**
         * License name
         */
        name: string;
        /**
         * URL of the license
         */
        url?: string;
    }

    /**
     * Contact information.
     */
    export interface Contact {
        /**
         * Contact name
         */
        name: string;
        /**
         * Support team web site URL
         */
        url: string;
        /**
         * Contacting e-mail address(es)
         */
        email: string;
    }

    /**
     * eTS service metdata. Each single service instance must be registered in the knowledge hub registry in order to provide its services.
     */
    export interface Service {
        /**
         * Descriptive name of the service
         */
        title: string;
        /**
         * URL with the terms of service (i.e. the service component in general).
         */
        termsOfService?: string;
        /**
         * Short description of the service itself, data provided, etc
         */
        description: string;
        contact: Contact;
        license: License;
        /**
         * Version of the service.
         */
        version: string;
        /**
         * UUID of a service. A service must provide an UUID in its metadata specification to uniquely identify the service.
         */
        uuid: string;
        /**
         * Type of the service:   * `frontend`   - UI application service, web frontend, etc   * `registry`   - KH registry service   * `database`   - database service, data provider, etc   * `security`   - security and authentication service   * `semantic`   - semantic service   * `aggregator` - aggregation service   * `similarity` - similarity search service   # to be extended
         */
        serviceType: Service.ServiceTypeEnum;
        /**
         * Service provider description, free text.
         */
        provider: string;
        /**
         * Date the initial version of service component was created first.
         */
        created?: string;
        /**
         * Date when the actual service component was released.
         */
        released?: string;
        /**
         * Date of the last changes in the actual service component.
         */
        lastChanged: string;
        /**
         * DNS name of the endpoint.
         */
        address?: string;
        /**
         * Base path of the service API endpoints.
         */
        basePath: string;
        /**
         * List of software products used by the service component internally.
         */
        software?: Array<Software>;

        readinessCheck: string;
        livenessCheck: string;
        payload: any;

    }
    export namespace Service {
        export type ServiceTypeEnum = 'frontend' | 'registry' | 'database' | 'security' | 'semantic' | 'aggregator' | 'similarity';
        export const ServiceTypeEnum = {
            Frontend: 'frontend' as ServiceTypeEnum,
            Registry: 'registry' as ServiceTypeEnum,
            Database: 'database' as ServiceTypeEnum,
            Security: 'security' as ServiceTypeEnum,
            Semantic: 'semantic' as ServiceTypeEnum,
            Aggregator: 'aggregator' as ServiceTypeEnum,
            Similarity: 'similarity' as ServiceTypeEnum
        };
    }
}