const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// defining schema for our todo API
var TodoSchema = new Schema({
  todo: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// export our model
var Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
