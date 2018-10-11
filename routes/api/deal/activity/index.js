const R = require('ramda');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * @param {Object} ctx
 * @return {Promise}
 */
async function index(ctx) {
  const {Deal, DealActivity} = ctx.db.models;

  let identity = ctx.state.user;
  let dealId = ctx.params['dealId'];

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
      ['updatedAt', 'DESC']
    ]
  });

  ctx.body = records.map(e => R.omit(['deal'], e.toJSON()));
}

module.exports = index;
