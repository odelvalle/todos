const Todo = require('../models/todo');
const schema = require('../swagger/schema')

const TodoCtrl = {
    // Get all todos from the Database
    GetTodo: (req, res) => {
      let filter = {};
      if (req.query.status) {
        const error = schema.validate({
          path: '/todos',
          method: 'get',
          parameter: 'status',
          value: req.query.status
        });
        if (error) return res.status(400).json({status: false, error: error.message});

        filter = { completed: req.query.status === 'completed' };
      }

      Todo.find(filter, (err, todos) => {
        if (err) return res.status(500).json({status: false, error: err.message});

        return res.json({ status: true, todo: todos.map( todo => ({
          id: todo.id,
          todo: todo.todo,
          created: todo.created,
          completed: todo.completed }))
        });
      });
    },

    // Get todo by id from the Database
    GetOneTodo: (req, res) => {
      const error = schema.validate({
        path: '/todos/{id}',
        method: 'get',
        parameter: 'id',
        value: req.params.id
      });
      if (error) return res.status(400).json({status: false, error: error.message});

      Todo.findOne({_id: req.params.id}, (err, todo) => {
        if (err) return res.status(500).json({status: false, error: err.message});
        if (todo === null) return res.status(404).json({status: false, error: 'Not found'});

        return res.json({status: true, todo: {
          id: todo.id,
          todo: todo.todo,
          created: todo.created,
          completed: todo.completed
        }});
      });
    },

    // Post a todo into Database
    PostTodo: async (req, res) => {
      const error = schema.validate({
        path: '/todos',
        method: 'post',
        parameter: 'task',
        value: req.body
      });
      if (error) return res.status(400).json({status: false, error: error.message});

      const todo = await Todo.create(req.body)
      todo.save((err, todo) => {
        if (err) return res.status(500).json({status: false, error: err.message});

        return res.status(201).json({status: true, todo: {
          id: todo.id,
          todo: todo.todo,
          created: todo.created,
          completed: todo.completed
        }});
      });
    },

    //Updating a todo status based on an ID
    UpdateTodo: (req, res) => {
      const bodyError = schema.validate({
        path: '/todos/{id}',
        method: 'patch',
        parameter: 'task',
        value: req.body
      });
      if (bodyError) return res.status(400).json({status: false, error: bodyError.message});
      if (req.body.completed === undefined && req.body.todo === undefined) {
        return res.status(400).json({status: false, error: "todo or completed properties are required."});
      }

      const idError = schema.validate({
        path: '/todos/{id}',
        method: 'patch',
        parameter: 'id',
        value: req.params.id
      });
      if (idError) return res.status(400).json({status: false, error: idError.message});

      var task = req.body;
      Todo.findOne({_id: req.params.id}, (err, todo) => {
        if (err) return res.status(500).json({status: false, error: err.message});
        if (todo === null) return res.status(404).json({status: false, error: 'Not found'});

        // update model
        todo.completed = task.completed || todo.completed;
        todo.todo = task.todo || todo.todo;

        todo.save((err, todo) => {
          if (err) return res.status(500).json({status: false, error: err.message});

          return res.json({status: true, todo: {
            id: todo.id,
            todo: todo.todo,
            created: todo.created,
            completed: todo.completed
          }});
        });
      });
    },

    // Deleting a todo baed on an ID
    DeleteTodo: (req, res) => {
      const idError = schema.validate({
        path: '/todos/{id}',
        method: 'patch',
        parameter: 'id',
        value: req.params.id
      });
      if (idError) return res.status(400).json({status: false, error: idError.message});

      Todo.remove({_id: req.params.id}, (err, todo) => {
        if (err) return res.status(500).json({status: false, error: err.message});
        if (todo.result.n === 0) return res.status(404).json({status: false, error: 'Path not found.'});

        return res.status(204).end();
      });
    }
}

module.exports = TodoCtrl;
