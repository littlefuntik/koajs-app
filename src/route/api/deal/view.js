const Boom = require('boom');

/**
 * @param {Object} ctx
 * @param {string} dealId
 * @return {Promise}
 */
async function mw(ctx, dealId) {
  const {Deal} = ctx.db.models;

  let identity = ctx.state.user;

  let deal = await Deal.findById(dealId);

  let dealMerchant = await deal.getMerchant();
  let dealCustomer = await deal.getCustomer();

  let participates = identity.equals(dealMerchant) || identity.equals(dealCustomer);

  if (!participates) {
    ctx.throw(Boom.forbidden());
  }

  ctx.body = deal.toJSON();
}

module.exports = mw;
