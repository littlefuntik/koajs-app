const path = require('path');
const Sequelize = require('sequelize');

try {
  /**
   * If you are working with the PostgreSQL TIMESTAMP WITHOUT TIME ZONE and you need to parse it to a different timezone, please use the pg library's own parser.
   * @see http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types
   */
  require('pg').types.setTypeParser(1114, stringValue => {
    return new Date(stringValue + '+0000');
    // e.g., UTC offset. Use any offset that you would like.
  });
} catch (e) {
  if (!(e instanceof Error && 'MODULE_NOT_FOUND' === e.code)) throw e;
}

const _modelsImport = Symbol();
const _modelsExpansion = Symbol();
const _modelsRelations = Symbol();

class Storage {
  constructor() {
    /**
     * @type {Sequelize|null}
     */
    this.sequelize = null;
    /**
     * @type {{User: Model, Deal: Model, DealActivity: Model}|null}
     */
    this.models = null;
  }

  /**
   * Create Sequelize connections pool.
   * @param {string} database
   * @param {string} username
   * @param {string} password
   * @param {Object} options
   * @return {Storage}
   */
  connect({database, username, password, options}) {
    this.sequelize = new Sequelize(database, username, password, options);
    this[_modelsImport]();
    this[_modelsRelations]();
    this[_modelsExpansion]();
    return this;
  }

  /**
   * Disconnect from Sequelize connections pool.
   * @return {Promise}
   */
  disconnect() {
    this.models = null;
    return this.sequelize.close();
  }

  sync() {
    return this.sequelize.sync(...arguments);
  }

  /**
   * Initialize models.
   * @private
   */
  [_modelsImport]() {
    const sequelize = this.sequelize;
    this.models = {
      User: sequelize.import(path.join(__dirname, 'models', 'user')),
      Deal: sequelize.import(path.join(__dirname, 'models', 'deal')),
      DealActivity: sequelize.import(path.join(__dirname, 'models', 'dealActivity'))
    };
  }

  /**
   * Initialize models relations.
   * @private
   */
  [_modelsRelations]() {
    const {User, Deal, DealActivity} = this.models;
    Deal.Merchant = Deal.belongsTo(User, {as: 'merchant'});
    Deal.Customer = Deal.belongsTo(User, {as: 'customer'});
    Deal.Activity = Deal.hasMany(DealActivity, {as: 'activity'});
    DealActivity.Receiver = DealActivity.belongsTo(User, {as: 'receiver'});
    DealActivity.Deal = DealActivity.belongsTo(Deal, {as: 'deal'});
  }

  /**
   * Expansion of models.
   * @see http://docs.sequelizejs.com/manual/tutorial/models-definition.html#expansion-of-models
   * @private
   */
  [_modelsExpansion]() {
    const {User, Deal, DealActivity} = this.models;

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
  }
}

module.exports = new Storage;
