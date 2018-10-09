const Boom = require('boom');
const jwt = require('jsonwebtoken');

/**
 * @param {KoaPassport} passport
 * @param {string} secret
 * @param {Object} ctx
 * @param {function} next
 * @return {Promise}
 */
async function login(passport, secret, ctx, next) {
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
