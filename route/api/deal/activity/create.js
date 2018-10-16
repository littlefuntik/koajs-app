const Boom = require('boom');

/**
 * @param {Object} ctx
 * @param {string} dealId
 * @return {Promise}
 */
async function mw(ctx, dealId) {
  const {Deal, DealActivity} = ctx.db.models;

  let sender = ctx.state.user;
  let dealId = ctx.params['dealId'];

  let deal = await Deal.findById(dealId);

  if (!await sender.canDealAnswer(deal)) {
    ctx.throw(Boom.forbidden());
  }

  let lastActivity = await deal.getLastActivity();
  let lastReceiver = await lastActivity.getReceiver();
  if (!lastReceiver.equals(sender)) {
    ctx.throw(Boom.forbidden());
  }

  let nextReceiver = await lastActivity.getNextReceiver();
  if (!nextReceiver) {
    ctx.throw(Boom.forbidden());
  }

  let newDealActivity = DealActivity.build({
    message: ctx.request.body['message'],
    price: ctx.request.body['price'] || lastActivity.price,
    accepted: false
  });

  await newDealActivity.save();
  await newDealActivity.setDeal(deal);
  await newDealActivity.setReceiver(nextReceiver);

  if (-1 === parseFloat(newDealActivity.price)) {
    deal.closed = true;
    await deal.save();
  }

  ctx.body = newDealActivity.toJSON();
}

module.exports = mw;
