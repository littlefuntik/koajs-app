/**
 * @param {Object} ctx
 * @return {Promise}
 */
async function mw(ctx) {
  ctx.body = ctx.state.user.toJSON();
}

module.exports = mw;
