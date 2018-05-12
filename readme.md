# Docker Boilerplate

This is a boilerplate project for a docker based node application. Each service should be very loosely coupled, with the frontend consuming a REST API supplied by the node backend, connected to a mongodb backend.

Services are contained in individual folders:

docker-mongo (port:27017) The mongodb database  
docker-node  (port:3000)  The node backend API  
docker-react (port:5000)  The react frontend app  

## Running the project
To run in development mode (locally, with hot-reload etc enabled):
> npm run-script start-dev

To stop dev servers running:  
Exit react console:  ```ctrl-c```  
Stop other services: ```npm run-script stop-dev```  

To run in production mode (locally, dockerized, no hot reloading)  
> npm run-script start-prod

To stop prod mode servers running:  
Stop everything: ```npm run-script stop-prod```
