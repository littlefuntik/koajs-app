const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * @param {Object} ctx
 * @return {Promise}
 */
async function mw(ctx) {
  const {User} = ctx.db.models;

  // let identity = ctx.state.user;

  let records = await User.findAll({
    // where: {
    //   id: {
    //     [Op.ne]: identity.id
    //   }
    // },
    order: [
      ['id', 'ASC']
    ]
  });

  ctx.body = records.map(e => e.toJSON());
}

module.exports = mw;
