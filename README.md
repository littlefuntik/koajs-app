# Example Koa web application

<p align="center">
 <img height="170" title="Open API" src="screenshots/openapi-swagger.png">
 <img height="170" title="Authenticate" src="screenshots/signup_or_login.png">
 <img height="170" title="Work Area" src="screenshots/workarea.png">
</p>

## Features

 - [x] Backend
 - [x] Frontend
 - [x] Docker
 - [ ] Tests (in progress)

## Main components

 - Koa web framework (https://koajs.com/)
 - Sequelize ORM (http://docs.sequelizejs.com/)
 - OpenAPI 3 (https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md)

## Run web application

 - Check configs in file ``PROJECT_ROOT/config.js``
 - run locally ``npm install && npm run start``
 - or using docker ``docker-compose up``

## Usage

For example, configure app to run on ``localhost:3000``

 - http://localhost:3000/api/ - API endpoint
 - http://localhost:3000/openapi.json - Open API schema
 - http://localhost:3000/openapi.html - Swagger location (API description)

## License

MIT
