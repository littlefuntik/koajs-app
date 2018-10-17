const modelName = 'deal';

/**
 * Define a new deal model.
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @return {Model}
 */
function createModel(sequelize, DataTypes) {
  const model = sequelize.define(modelName, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    finalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    closed: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return model;
}

module.exports = createModel;
