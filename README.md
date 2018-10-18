# Koa application

<p align="left">
 <img height="170" title="Open API" src="screenshots/openapi-swagger.png">
 <img height="170" title="Authenticate" src="screenshots/signup_or_login.png">
 <img height="170" title="Work Area" src="screenshots/workarea.png">
 <img height="170" title="Tests" src="screenshots/tests.png">

 [![Node.js](https://img.shields.io/badge/Node.js-latest-green.svg?style=flat)](https://nodejs.org/)
 [![Koa.js](https://img.shields.io/badge/Koa.js-v2-green.svg?style=flat)](https://koajs.com/)
 [![Open API](https://img.shields.io/badge/OpenAPI-v3-green.svg?style=flat)](https://www.openapis.org/)
 [![Swagger](https://img.shields.io/badge/Swagger-latest-green.svg?style=flat)](https://swagger.io/)
 [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-green.svg?style=flat)](https://www.postgresql.org/)
 [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://en.wikipedia.org/wiki/MIT_License)
</p>

## Usage

Check configs in file ``PROJECT_ROOT/config.js`` or environment variables.

Run application

```bash
docker-compose up

# or

npm install && npm run start
```

For example, configure app to run on ``localhost:3000``

 - http://localhost:3000/ - Main page
 - http://localhost:3000/api/ - API endpoint
 - http://localhost:3000/openapi.json - Open API schema
 - http://localhost:3000/openapi.html - Swagger location (API description)

## Tests

Run tests console command:

```bash
docker-compose -f docker-compose.test.yml run --rm web
```

## Features

 - [x] Backend
 - [x] Frontend
 - [x] Docker
 - [X] Tests (in progress)

## License

MIT
