const Boom = require('boom');
const jwt = require('jsonwebtoken');

/**
 * @param {Object} ctx
 * @param {function} next
 * @return {Promise}
 */
async function login(ctx, next) {
  /**
   * @type {KoaPassport}
   */
  const passport = ctx.state._passport.instance;
  const secret = ctx.config.jwt.secret;
  await passport.authenticate('local', function (error, user) {
    if (!user) {
      ctx.throw(Boom.badData('Incorrect email or password.'));
    } else {
      const payload = {id: user.id};
      const token = jwt.sign(payload, secret);
      ctx.body = {token: `JWT ${token}`};
    }
  })(ctx, next);
}

module.exports = login;
