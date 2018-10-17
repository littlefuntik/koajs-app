const R = require('ramda');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * @param {Object} ctx
 * @param {string} dealId
 * @return {Promise}
 */
async function mw(ctx, dealId) {
  const {DealActivity} = ctx.db.models;

  let identity = ctx.state.user;

  let records = await DealActivity.findAll({
    include: [{
      association: DealActivity.Deal,
      where: {
        id: dealId,
        [Op.or]: [
          {merchantId: identity.id},
          {customerId: identity.id}
        ]
      }
    }],
    order: [
      ['updatedAt', 'ASC']
    ]
  });

  ctx.body = records.map(e => R.omit(['deal'], e.toJSON()));
}

module.exports = mw;
