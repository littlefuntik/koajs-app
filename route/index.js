const _ = require('koa-route');
const Boom = require('boom');

module.exports = [
  // app
  _.post('/api/login', require('./api/login')),

  // user
  _.post('/api/user', require('./api/user/create')),

  // deal
  _.post('/api/deal', authenticate(require('./api/deal/create'))),
  _.post('/api/deal/:dealId/accept', authenticate(require('./api/deal/accept'))),
  _.get('/api/deal', authenticate(require('./api/deal/list'))),

  // deal activity
  _.post('/api/deal/:dealId/activity', authenticate(require('./api/deal/activity/create'))),
  _.get('/api/deal/:dealId/activity', authenticate(require('./api/deal/activity/list'))),
];

/**
 * Authenticate decorator.
 * @param {function} routeMiddleware
 * @return {function(ctx: Object, next: function): *}
 */
function authenticate(routeMiddleware) {
  return async function authenticateRouteMiddleware(ctx) {
    const passport = ctx.state._passport.instance;
    await passport.authenticate('jwt', {session: false})(ctx, function () {});;
    if (ctx.isUnauthenticated()) {
      ctx.throw(Boom.unauthorized());
    }
    return await routeMiddleware.apply(this, arguments);
  };
}
