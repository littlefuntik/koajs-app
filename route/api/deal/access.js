/**
 * @param {Object} ctx
 * @param {string} dealId
 * @return {Promise}
 */
async function mw(ctx, dealId) {
  const {Deal} = ctx.db.models;

  let identity = ctx.state.user;

  let deal = await Deal.findById(dealId);

  ctx.body = {
    canAnswer: await identity.canDealAnswer(deal)
  };
}

module.exports = mw;
