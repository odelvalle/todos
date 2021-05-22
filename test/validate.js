const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');
var Validator = require('jsonschema').Validator;

const doc = yaml.load(fs.readFileSync(path.join(__dirname, '../app/swagger/todo-swagger.yaml'), 'utf8'));

exports.response = (options) => {
  const validator = new Validator();
  validator.addSchema(doc['definitions'].Task, '/#/definitions/Task');
  validator.addSchema(doc['definitions'].Error, '/#/definitions/Error');

  const response = doc['paths'][options.path][options.method].responses[options.status];
  const validate = validator.validate(options.value, response.schema, { base: '/' });
  if (!validate.valid) return validate.errors[0];

  return null;
}