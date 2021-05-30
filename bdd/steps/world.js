require('../../server.js');
const {setWorldConstructor} = require("@cucumber/cucumber");

class CustomWorld {
    constructor({parameters}) {
        this.context = {};
    }
}

setWorldConstructor(CustomWorld);