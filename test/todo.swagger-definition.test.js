
const swaggerTests = require('driven-swagger-test/src/swagger');
require('../server.js');

describe.only('Integration test', () => {
  it('I can run all integration test', done => {
    swaggerTests('app/swagger/todo-swagger.yaml')
      .then(results => {
        const errors = results.tests.definition.some(result => result.code >= 5000);
        if (errors) { done(new Error('Errors in test')); return; }

        done();
      })
      .catch(error => {
        done(error);
      });
  });
});

