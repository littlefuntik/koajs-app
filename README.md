# Koa application

<p align="center">
 <img height="170" title="Open API" src="screenshots/openapi-swagger.png">
 <img height="170" title="Authenticate" src="screenshots/signup_or_login.png">
 <img height="170" title="Work Area" src="screenshots/workarea.png">

 [![Node.js](https://img.shields.io/badge/Node.js-latest-green.svg?style=flat)](https://nodejs.org/)
 [![Koa.js](https://img.shields.io/badge/Koa.js-v2-green.svg?style=flat)](https://koajs.com/)
 [![Open API](https://img.shields.io/badge/OpenAPI-v3-green.svg?style=flat)](https://www.openapis.org/)
 [![Swagger](https://img.shields.io/badge/Swagger-latest-green.svg?style=flat)](https://swagger.io/)
 [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-green.svg?style=flat)](https://www.postgresql.org/)
 [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://www.postgresql.org/)
</p>

## Usage

Check configs in file ``PROJECT_ROOT/config.js``.
See environment variables.

### Usage

Run application

```$bash
docker-compose up

# or

npm install && npm run start
```

For example, configure app to run on ``localhost:3000``

 - http://localhost:3000/api/ - API endpoint
 - http://localhost:3000/openapi.json - Open API schema
 - http://localhost:3000/openapi.html - Swagger location (API description)

## Features

 - [x] Backend
 - [x] Frontend
 - [x] Docker
 - [ ] Tests (in progress)

## Main components

 - Koa web framework (https://koajs.com/)
 - Sequelize ORM (http://docs.sequelizejs.com/)
 - OpenAPI 3 (https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md)

## License

MIT
