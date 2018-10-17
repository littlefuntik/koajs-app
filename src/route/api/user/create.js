const R = require('ramda');

/**
 * @param {Object} ctx
 * @return {Promise}
 */
async function create(ctx) {
  const {User} = ctx.db.models;

  let user = User.build({
    email: ctx.request.body['email'],
    passwordHash: ctx.request.body['password']
  });

  await user.save();

  ctx.body = R.pick(
    [
      'id',
      'email',
      'createdAt'
    ],
    user.toJSON()
  );
}

module.exports = create;
