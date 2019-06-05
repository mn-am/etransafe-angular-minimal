# eTRANSAFE Angular Minimal Example

A minimal Angular web application that can be deployed as container in the eTRANSAFE Knowledge Hub. It includes the following features:
- configure Angular application with environment variables for deployment in the Knowledge Hub
- Log in using API endpoint environment variable and retrieve the JWT token that will be used for subsequent requests starting with "/"
- Make a request to Knowledge Hub Registry and list all available services 

# Prerequisites
- nodejs 10 or higher
- local docker installation
- account in the eTRANSAFE develop environment
- access to eTRANSAFE docker registry in order to publish the docker container

# Usage

## Install required node modules
Run `npm ci` to install the required dependencies.

## Run development server
Run `npm run ng serve` for a dev server. Navigate to `http://localhost:4200/`. 
The app will automatically reload if you change any of the source files. 
The Angular app is by default configured to use the eTRANSAFE development environment. 
For a successful log in, an account for the eTRNSAFE Knowledge Hub is required.

## Build docker container
Run `npm run build_docker` in order to build the docker container. 
In order to see if the docker container has been built successfully, run `docker images`. 
You should see a container labeled `wp9/mn-am/etransafe-angular-minimal`

## Run docker container
In order to start, the docker container needs a set of environment variables:

 Variable | Description | Example 
--- | --- | --- 
BASE_HREF | `<base href>` tag used in index html | "/" 
ETS_ENVIRONMENT | DEVELOPMENT or TESTING or PRODUCTION` | "DEVELOPMENT" 
ETS_GATEWAY_URL | URL pointing to the environment in which the container was deployed |  
ETS_AUTHENTICATION_API_URL | path pointing to the login API | /etssp.kh.svc/auth/api/v1/login 
ETS_KNOWLEDGE_HUB_REGISTRY_API_URL | path pointing to the Knowledge Hub Registry | registry.kh.svc 

For deployment in the Knowledge Hub, these environment variables are provided by the cloud environment


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.
