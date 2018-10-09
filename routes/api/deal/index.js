const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * @param {Model} Deal
 * @param {Object} ctx
 * @return {Promise}
 */
async function index(Deal, ctx) {
  let identity = ctx.state.user;

  let records = await Deal.findAll({
    where: {
      [Op.or]: [
        {merchantId: identity.id},
        {customerId: identity.id}
      ]
    },
    order: [
      ['updatedAt', 'DESC']
    ]
  });

  ctx.body = records.map(e => e.toJSON());
}

module.exports = index;
