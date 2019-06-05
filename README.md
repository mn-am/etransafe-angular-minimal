# eTRANSAFE Angular Minimal example

A minimal Angular web application that can be deployed as container in the eTRANSAFE Knowledge Hub. It includes the following features:
- configure Angular application for deployment in Knowledge Hub
- Log in using API enpoint
- Retrieve JWT token and save in local storage
- add the JWT to each http request that starts with "/" using an Angular http interceptor
- make request to Knowledge Hub Registry and list all available services 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

# Requirements
- nodejs 10 or higher

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.


## Running the Docker container

### Required Environment Variables
ETS_ENVIRONMENT	DEVELOPMENT
ETS_GATEWAY_URL	https://dev.etransafe.130.226.24.120.nip.io
ETS_AUTHENTICATION_API_URL	/etssp.kh.svc/auth/api/v1/login
ETS_KNOWLEDGE_HUB_REGISTRY_API_URL	registry.kh.svc
BASE_HREF	/


ttempt | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 | #11
--- | --- | --- | --- |--- |--- |--- |--- |--- |--- |--- |---
Seconds | 301 | 283 | 290 | 286 | 289 | 285 | 287 | 287 | 272 | 276 | 269
## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
# etransafe-angular-minimal
