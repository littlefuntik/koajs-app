const R = require('ramda');

/**
 * @param {Model} user
 * @param {Object} ctx
 * @return {Promise}
 */
async function create(user, ctx) {
  let record = user.build({
    email: ctx.request.body['email'],
    passwordHash: ctx.request.body['password']
  });

  await record.save();

  ctx.body = R.pick(
    [
      'id',
      'email',
      'createdAt'
    ],
    record.toJSON()
  );
}

module.exports = create;
