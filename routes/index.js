const Router = require('koa-router');

const api = new Router({prefix: '/api'});

api.post('/login', require('./api/login'));
api.post('/user', require('./api/user/create'));
api.get('/deal', require('./api/deal/index'));
api.post('/deal', require('./api/deal/create'));
api.post('/deal/:dealId/accept', require('./api/deal/accept'));
api.get('/deal/:dealId/activity', require('./api/deal/activity/index'));
api.post('/deal/:dealId/activity', require('./api/deal/activity/create'));

module.exports = {
  api
};
