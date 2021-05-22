const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const todos = require('./app/routes/todo.routes');
const config = require('./app/config/config');

// log every request to the console
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}));
// parse application/json
app.use(bodyParser.json());

app.use('/api', todos);

// use global promise
mongoose.Promise = global.Promise;
// connect MongoDB using mongoose to our application
mongoose.connect(config.db, {
  useMongoClient: true
});

// express application will listen to port mentioned in our configuration
app.listen(config.port, (err) => {
  if (err) throw err;
  console.log("App listening on port " + config.port);
});

