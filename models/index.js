const Sequelize = require('sequelize');
const path = require('path');

/**
 * If you are working with the PostgreSQL TIMESTAMP WITHOUT TIME ZONE and you need to parse it to a different timezone, please use the pg library's own parser.
 * @see http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types
 */
function configureDateTime() {
  require('pg').types.setTypeParser(1114, stringValue => {
    return new Date(stringValue + '+0000');
    // e.g., UTC offset. Use any offset that you would like.
  });
}

/**
 * Create new database connections pull.
 * @param {string} database
 * @param {string} username
 * @param {string} password
 * @param {Object} options
 * @return {{user: Model, deal: Model, dealActivity: Model, sequelize: Sequelize}}
 */
function setup(database, username, password, options) {
  options = options || {};

  configureDateTime();

  // create ORM instance
  let sequelize = new Sequelize(database, username, password, options);

  // import models
  const User = sequelize.import(path.join(__dirname, 'user'));
  const Deal = sequelize.import(path.join(__dirname, 'deal'));
  const DealActivity = sequelize.import(path.join(__dirname, 'dealActivity'));

  // define relations
  Deal.Merchant = Deal.belongsTo(User, {as: 'merchant'});
  Deal.Customer = Deal.belongsTo(User, {as: 'customer'});
  Deal.Activity = Deal.hasMany(DealActivity, {as: 'activity'});
  DealActivity.Receiver = DealActivity.belongsTo(User, {as: 'receiver'});
  DealActivity.Deal = DealActivity.belongsTo(Deal, {as: 'deal'});

  // TODO: need refactoring Deal.prototype.getLastActivity()
  Deal.prototype.getLastActivity = async function () {
    let records = await this.getActivity({order: [['id', 'DESC']], limit: 1});
    return records[0] || null;
  };

  // TODO: need refactoring Deal.prototype.getNextReceiver()
  Deal.prototype.getNextReceiver = async function () {
    let lastActivity = await this.getLastActivity();
    if (!lastActivity) {
      return await this.getMerchant();
    }
    return await lastActivity.getNextReceiver();
  };

  // TODO: need refactoring DealActivity.prototype.getNextReceiver()
  DealActivity.prototype.getNextReceiver = async function () {
    let deal = await this.getDeal();
    let dealMerchant = await deal.getMerchant();
    let dealCustomer = await deal.getCustomer();
    let lastReceiver = await this.getReceiver();
    if (lastReceiver.equals(dealMerchant)) {
      return dealCustomer;
    }
    if (lastReceiver.equals(dealCustomer)) {
      return dealMerchant;
    }
    return null;
  };

  // TODO: need refactoring User.prototype.canDealAnswer()
  User.prototype.canDealAnswer = async function (deal) {
    if (typeof deal === 'number') {
      deal = await Deal.findById(deal);
    }
    if (!deal || deal.closed) {
      return false;
    }
    let lastActivity = await deal.getLastActivity();
    let lastReceiver = await lastActivity.getReceiver();
    return this.id === lastReceiver.id;
  };

  return {
    user: User,
    deal: Deal,
    dealActivity: DealActivity,
    sequelize: sequelize
  };
}

module.exports = setup;
