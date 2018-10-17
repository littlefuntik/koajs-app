const modelName = 'dealActivity';

/**
 * Define a new deal activity model.
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return model;
}

module.exports = createModel;
