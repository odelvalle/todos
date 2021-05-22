const {Given, When, Then, AfterAll, After} = require('@cucumber/cucumber');
const assert = require('assert').strict
const rest = require('../helpers/rest');

Given('A Todo {}', function (request) {
    this.context['request'] = JSON.parse(request);
});

When('I send POST request to {}', async function (path) {
    this.context['response'] = await rest.postData(`http://localhost:3000/api${path}`, this.context['request']);
})

Then('I get response code {int}', async function (code) {
    assert.equal(this.context['response'].status, code);
});

When('I send PATCH request with a {} to {}', async function (completed, path) {
    const response = await rest.patchData(`http://localhost:3000/api${path}/${this.context['id']}`, JSON.parse(completed));
    this.context['response'] = response;
})

Given('The Todo with {} exist', async function (id) {
    this.context['id'] = id;
})

When('I send GET request to {}', async function (path) {
    const response = await rest.getData(`http://localhost:3000/api${path}/${this.context['id']}`);
    this.context['response'] = response;
})

Then(/^I receive (.*)$/, async function (expectedResponse) {
    assert.deepEqual(this.context['response'].data, JSON.parse(expectedResponse));
})

When('I send DELETE request to {}', async function (path) {
    const response = await rest.deleteData(`http://localhost:3000/api${path}/${this.context['id']}`);
    this.context['response'] = response;
})