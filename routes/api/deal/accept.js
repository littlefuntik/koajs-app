const Boom = require('boom');

/**
 * @param {Object} ctx
 * @return {Promise}
 */
async function create(ctx) {
  const {Deal, DealActivity} = ctx.db.models;

  let identity = ctx.state.user;
  let dealId = ctx.params['dealId'];

  let deal = await Deal.findById(dealId);

  if (!await identity.canDealAnswer(deal)) {
    ctx.throw(Boom.forbidden());
  }

  let lastActivity = await deal.getLastActivity();

  let newDealActivity = DealActivity.build({
    message: ctx.request.body['message'],
    price: lastActivity.price,
    accepted: true
  });

  await newDealActivity.save();
  await newDealActivity.setDeal(deal);

  deal.finalPrice = lastActivity.price;
  deal.closed = true;
  await deal.save();

  ctx.body = newDealActivity.toJSON();
}

module.exports = create;
