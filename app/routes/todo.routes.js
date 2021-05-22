const express = require('express');
const router = express.Router();

const TodoController = require('../controllers/todo.controller');

// Get all todos
router.get('/todos', TodoController.GetTodo);
router.get('/todos/:id', TodoController.GetOneTodo);
router.post('/todos', TodoController.PostTodo);
router.patch('/todos/:id', TodoController.UpdateTodo);
router.delete('/todos/:id', TodoController.DeleteTodo);

module.exports = router;
