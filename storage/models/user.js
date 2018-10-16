const modelName = 'user';
const passwordHashPlugin = require('../../plugins/models/passwordHash');

/**
 * Define a new user model.
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: [true],
          msg: 'Email is not valid'
        }
      }
    },
    passwordHash: DataTypes.STRING
  }, {
    timestamps: true,
    updatedAt: false
  });

  passwordHashPlugin(model, 'passwordHash').enable();

  return model;
}

module.exports = createModel;
