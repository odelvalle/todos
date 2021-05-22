"use strict";

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

const { mockReq, mockRes } = require('sinon-express-mock');
const expect = chai.expect;

// require('mongoose');
require('sinon-mongoose');
require('sinon-as-promised');

chai.use(sinonChai);

// import our todo model for unit testing
const Todo = require('../app/models/todo');
const controller = require('../app/controllers/todo.controller')

let TodoMock;

describe('Todo Unit testing', () => {
  describe('/GET todos', () => {
    // test will pass if we get all todos
    it('should fetch all todos', (done) => {
      TodoMock = sinon.mock(Todo);
      const expectedMongoResult = [{
        id: '123456789012345678901234',
        todo: 'example from test',
        created: Date.now(),
        completed: false
      }];
      TodoMock.expects('find').yields(null, expectedMongoResult);

      const req = mockReq();
      const res = mockRes();

      controller.GetTodo(req, res);

      const result = {status: true, todo: expectedMongoResult};
      expect(res.json).to.be.calledWith(result);

      done();
    });

    it('should fetch completed todos', (done) => {
      TodoMock = sinon.mock(Todo);
      const expectedMongoResult = [];
      TodoMock.expects('find').yields(null, expectedMongoResult);

      const req = mockReq({
        query: {
          status: 'completed'
        }
      });
      const res = mockRes();

      controller.GetTodo(req, res);

      const result = {status: true, todo: expectedMongoResult};
      expect(res.json).to.be.calledWith(result);

      done();
    });

    it('should return bad request if status is invalid', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('find').yields(null, null);

      const req = mockReq({
        query: {
          status: 'aaaaa'
        }
      });
      const res = mockRes();

      controller.GetTodo(req, res);
      expect(res.status).to.be.calledWith(400);

      done();
    });

    afterEach(function () {
      TodoMock.restore();
    });

    // test will fail to get all todos
    it('should return an error', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('find').yields(new Error(), null);

      const req = mockReq();
      const res = mockRes();

      controller.GetTodo(req, res);
      expect(res.status).to.be.calledWith(500);

      done();
    });

    afterEach(function () {
      TodoMock.restore();
    });
  });

  describe('/GET a todo', () => {
    // test will pass if we get a todo
    it('should fetch a todo', (done) => {
      TodoMock = sinon.mock(Todo);
      const expectedMongoResult = { id: "", todo: "", created: Date.now(), completed: false };
      TodoMock.expects('findOne').yields(null, expectedMongoResult);

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.GetOneTodo(req, res);
      expect(res.json).to.be.calledWith({status: true, todo: expectedMongoResult});

      done();
    });

    // test will fail to get a todo
    it('should return error if we can not get a todo', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('findOne').yields(new Error(), null);

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.GetOneTodo(req, res);
      expect(res.status).to.be.calledWith(500);

      done();
    });

    it('should return bad request if id is invalid', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('findOne').yields(new Error(), null);

      const req = mockReq({ params: { id: '123' } });
      const res = mockRes();

      controller.GetOneTodo(req, res);
      expect(res.status).to.be.calledWith(400);

      done();
    });

    it('should return not found if todo not exist', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('findOne').yields(null, null);

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.GetOneTodo(req, res);
      expect(res.status).to.be.calledWith(404);

      done();
    });

    afterEach(function () {
      TodoMock.restore();
    });
  });

  describe('/POST a new todo', () => {
    // test will pass if the todo is saved
    it('should create a new post', async () => {
      TodoMock = sinon.mock(Todo);
      const Model = new Todo();
      const todoModel = sinon.mock(Model);

      const expectedMongoResult = { id: '123456789012345678901234', todo: 'example from test', created: Date.now(), completed: false };
      TodoMock.expects('create').resolves(Model);
      todoModel.expects('save').yields(null, expectedMongoResult);

      const req = mockReq({ body: {todo: 'example from test'}});
      const res = mockRes();

      await controller.PostTodo(req, res);
      expect(res.status).to.be.calledWith(201);
      expect(res.json).to.be.calledWith({status: true, todo: expectedMongoResult});
    });

    it('should return an error if todo not saved', async () => {
      TodoMock = sinon.mock(Todo);
      const Model = new Todo();
      const todoModel = sinon.mock(Model);

      TodoMock.expects('create').resolves(Model);
      todoModel.expects('save').yields(new Error(), null);

      const req = mockReq({ body: {todo: 'example from test'}});
      const res = mockRes();

      await controller.PostTodo(req, res);
      expect(res.status).to.be.calledWith(500);
    });

    it('should return bad request if todo is invalid', async () => {
      TodoMock = sinon.mock(Todo);
      const Model = new Todo();
      const todoModel = sinon.mock(Model);

      TodoMock.expects('create').resolves(Model);
      todoModel.expects('save').yields(new Error(), null);

      const req = mockReq({ body: {task: 'example from test'}});
      const res = mockRes();

      await controller.PostTodo(req, res);
      expect(res.status).to.be.calledWith(400);
    });

    afterEach(function () {
      TodoMock.restore();
    });
  });

  describe('/PATCH update a todo by id', () => {
    it('should patch a todo', (done) => {
      TodoMock = sinon.mock(Todo);
      const Model = new Todo({ id: "123456789012345678901234", todo: "example", created: Date.now(), completed: false });
      const todoModel = sinon.mock(Model);

      const expectedMongoPatchResult = { id: "123456789012345678901234", todo: "example 1", created: Date.now(), completed: false };

      TodoMock.expects('findOne').yields(null, Model);
      todoModel.expects('save').yields(null, expectedMongoPatchResult);


      const req = mockReq({
        params: { id: '123456789012345678901234' },
        body: { todo: 'example 1' }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);
      expect(res.json).to.be.calledWith({status: true, todo: expectedMongoPatchResult});

      done();
    });

    // test will fail to get a todo
    it('should return error if we can not get a todo', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('findOne').yields(new Error(), null);

      const req = mockReq({
        params: { id: '123456789012345678901234' },
        body: { todo: 'example 1' }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);
      expect(res.status).to.be.calledWith(500);

      done();
    });

    it('should return error if we can not patch a todo', (done) => {
      TodoMock = sinon.mock(Todo);
      const Model = new Todo({ id: "123456789012345678901234", todo: "example", created: Date.now(), completed: false });
      const todoModel = sinon.mock(Model);

      TodoMock.expects('findOne').yields(null, Model);
      todoModel.expects('save').yields(new Error(), null);

      const req = mockReq({
        params: { id: '123456789012345678901234' },
        body: { todo: 'example 1' }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);
      expect(res.status).to.be.calledWith(500);

      done();
    });

    it('should return bad request if id is invalid', (done) => {
      TodoMock = sinon.mock(Todo);

      const req = mockReq({
        params: { id: '1234' },
        body: { todo: 'example 1' }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);
      expect(res.status).to.be.calledWith(400);

      done();
    });

    it('should return bad request if todo is invalid', (done) => {
      TodoMock = sinon.mock(Todo);

      const req = mockReq({
        params: { id: '123456789012345678901234' },
        body: { completed: 'example 1' }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);
      expect(res.status).to.be.calledWith(400);

      done();
    });

    it('should return bad request if body is invalid', (done) => {
      TodoMock = sinon.mock(Todo);

      const req = mockReq({
        params: { id: '123456789012345678901234' },
        body: { }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);
      expect(res.status).to.be.calledWith(400);

      done();
    });

    it('should return not found if todo not exist', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('findOne').yields(null, null);

      const req = mockReq({
        params: { id: '123456789012345678901234' },
        body: { completed: true }
      });
      const res = mockRes();

      controller.UpdateTodo(req, res);
      expect(res.status).to.be.calledWith(404);

      done();
    });

    afterEach(function () {
      TodoMock.restore();
    });
  });

  describe('/DELETE remove a todo by id', function() {

    // it will pass if the todo is deleted
    it('should delete a todo by id', function(done) {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('remove').withArgs({_id: '123456789012345678901234'}).yields(null, {
        result: { n: 1 }
      });

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.DeleteTodo(req, res);
      expect(res.status).to.be.calledWith(204);

      done();
    });

    // it will pass if the todo is not deleted
    it('should return an error if todo is not deleted', function(done) {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('remove').withArgs({_id: '123456789012345678901234'}).yields(new Error(), null);

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.DeleteTodo(req, res);
      expect(res.status).to.be.calledWith(500);

      done();
    });

    it('should return bad request if id is invalid', function(done) {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('remove').withArgs({id: '123456789012345678901234'}).yields(new Error(), null);

      const req = mockReq({ params: { id: '123456' } });
      const res = mockRes();

      controller.DeleteTodo(req, res);
      expect(res.status).to.be.calledWith(400);

      done();
    });

    it('should return not found if todo not exist', (done) => {
      TodoMock = sinon.mock(Todo);
      TodoMock.expects('remove').withArgs({_id: '123456789012345678901234'}).yields(null, {
        result: { n: 0 }
      });

      const req = mockReq({ params: { id: '123456789012345678901234' } });
      const res = mockRes();

      controller.DeleteTodo(req, res);
      expect(res.status).to.be.calledWith(404);

      done();
    });


    afterEach(function () {
      TodoMock.restore();
    });
  });
});