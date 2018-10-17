/**
 * @param {Object} ctx
 * @return {Promise}
 */
async function mw(ctx) {
  const {User, Deal} = ctx.db.models;

  let sender = ctx.state.user;
  let receiver = await User.findById(ctx.request.body['receiver']);

  let deal = Deal.build({
    finalPrice: null,
    closed: false,
    activity: [{
      message: ctx.request.body['message'],
      price: ctx.request.body['price'],
      accepted: false
    }]
  }, {
    include: [{
      association: Deal.Activity
    }]
  });

  await deal.save();

  await deal.setMerchant(sender);
  await deal.setCustomer(receiver);

  let activity = await deal.getActivity({limit: 1});
  activity[0].setReceiver(receiver);
  await activity[0].save();

  await deal.reload();

  ctx.body = deal.toJSON();
}

module.exports = mw;
