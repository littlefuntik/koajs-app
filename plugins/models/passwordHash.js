const bcrypt = require('bcrypt');
const pluginName = 'passwordHash';

/**
 * Create hash from text value.
 * @param {string} input
 * @return {Promise}
 */
function createHash(input) {
  return bcrypt.hash(input, 10);
}

/**
 * Compare password with hash value.
 * @param password
 * @param hash
 * @return {Promise}
 */
function validatePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Update password logic.
 * @param {Model} instance
 * @param {string} attribute
 * @return {Promise}
 */
async function updatePasswordAttr(instance, attribute) {
  if (instance.changed(attribute)) {
    instance.setDataValue(attribute, await createHash(instance.getDataValue(attribute)));
  }
}

/**
 * Activate plugin.
 * @param {Model} model
 * @param {string} attribute
 */
function enable(model, attribute) {
  model.addHook('beforeCreate', pluginName, instance => updatePasswordAttr(instance, attribute));
  model.addHook('beforeUpdate', pluginName, instance => updatePasswordAttr(instance, attribute));
  model.prototype.validatePassword = function (password) {
    return validatePassword(password, this.getDataValue(attribute));
  }
}

/**
 * Deactivate plugin.
 * @param {Model} model
 * @param {string} attribute
 */
function disable(model, attribute) {
  model.removeHook('beforeCreate', pluginName);
  model.removeHook('beforeUpdate', pluginName);
  delete model.prototype.validatePassword;
}

/**
 * Setup plugin.
 * @param {Model} model
 * @param {string} attribute
 * @return {{enable, disable}}
 */
function setup(model, attribute) {
  return {
    enable: () => enable(model, attribute),
    disable: () => disable(model, attribute),
  };
}

module.exports = setup;
