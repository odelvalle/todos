const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');
var Validator = require('jsonschema').Validator;

const doc = yaml.load(fs.readFileSync(path.join(__dirname, 'todo-swagger.yaml'), 'utf8'));

/**
 *
 * @param {object} options
 * @param {string} options.path
 * @param {string} options.method
 * @param {string} options.parameter
 * @param {string} options.value
 * @returns
 */
exports.validate = (options) => {
  const validator = new Validator();

  const method = doc['paths'][options.path][options.method];
  const param = method.parameters.find(param => param.name === options.parameter);
  const validate = validator.validate(options.value, param.schema || param);
  if (!validate.valid) return validate.errors[0];

  return null;
}