"use strict";

const request = require('supertest');
require('../server.js');

const api = request('http://localhost:3000');

const chai = require('chai');
const expect = chai.expect;

const validate = require('./validate');

describe('Todo CRUD integration testing', () => {
  describe('/GET fetch all todos', () => {

    it('should return a 200 response', (done) => {
			api.get('/api/todos')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(validate.response({
            path: '/todos',
            method: 'get',
            status: '200',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.true;
          done();
        });
		});

    it('should return status as false', (done) => {
      api.get('/api/todos')
        .query({ status: 'aaaa' })
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);

          expect(validate.response({
            path: '/todos',
            method: 'get',
            status: '400',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.false;
          done();
        });
    });

    it('should return completed as true', (done) => {
      api.get('/api/todos')
      .query({ status: 'completed' })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return done(err);

        expect(validate.response({
          path: '/todos',
          method: 'get',
          status: '200',
          value: res.body
        })).to.be.null;

        expect(res.body.status).to.be.true;
        done();
      });
    });
  });

  describe('/GET/:id fetch a todo by id', () => {
    var response = {};

    before((done) => {
      var newTodo = {todo: 'Todo from hooks'};
      api.post('/api/todos')
         .set('Accept', 'application/json')
         .send(newTodo)
         .expect(201)
         .end((err, res) => {
           if (err) return done(err);

           response = res.body;
           done();
          });
    });

    it('should return a 200 response', (done) => {
			api.get('/api/todos/' + response.todo.id)
         .set('Accept', 'application/json')
			   .expect(200, done);
		});

    it('should return an object with keys and values', (done) => {
      api.get('/api/todos/' + response.todo.id)
         .set('Accept', 'application/json')
         .end((err, res) => {
           if (err) return done(err);

           expect(res.body).to.have.property('status');
           expect(res.body.status).to.not.equal(null);
           expect(res.body.todo).to.be.a('object');
           expect(res.body.todo).to.have.property('todo');
           expect(res.body.todo.todo).to.not.equal(null);
           expect(res.body.todo).to.have.property('completed');
           expect(res.body.todo.completed).to.not.equal(null);
           done();
         });
    });

    it('should return status as true', (done) => {
      api.get('/api/todos/' + response.todo.id)
         .set('Accept', 'application/json')
         .end((err, res) => {
           if (err) return done(err);

           expect(res.body.status).to.be.true;
           done();
         });
    });
  });

  describe('/POST save a new todo', () => {

    it('should be able to save a new todo', (done) => {
      var newTodo = {todo: 'New Todo'};
      api.post('/api/todos')
         .set('Accept', 'application/json')
         .send(newTodo)
         .expect('Content-Type', /json/)
         .expect(201)
         .end((err, res) => {
            if (err) return done(err);

            expect(res.body.status).to.be.true;
            done();
          });
    });
  });

  describe('/PATCH/:id update a todo', () => {

    var response = {};

    before((done) => {
      var newTodo = {todo: 'Todo from hooks'};
      api.post('/api/todos')
         .set('Accept', 'application/json')
         .send(newTodo)
         .expect('Content-Type', /json/)
         .expect(201)
         .end((err, res) => {
          if (err) return done(err);

           response = res.body;
           done();
          });
    });

    it('should be able to update a todo using id', (done) => {
      var updatedTodo = {completed: true};
      api.patch('/api/todos/' + response.todo.id)
         .set('Accept', 'application/json')
         .send(updatedTodo)
         .expect('Content-Type', /json/)
         .expect(200)
         .end((err, res) => {
          if (err) return done(err);

           expect(res.body.status).to.be.true;
           expect(res.body.todo.completed).to.be.true;
           done();
         });
    });
  });

  describe('/DELETE/:id delete a todo', () => {

    var response = {};

    before((done) => {
      var newTodo = {todo: 'Todo from hooks'};
      api.post('/api/todos')
         .set('Accept', 'application/json')
         .send(newTodo)
         .expect('Content-Type', /json/)
         .expect(201)
         .end((err, res) => {
           if (err) return done(err);

           response = res.body;
            done();
          });
    });

    it('should be able to delete a todo', (done) => {
      api.delete('/api/todos/' + response.todo.id)
         .expect(204)
         .end((err, res) => {
           if (err) return done(err);
           done();
         });
    });
  });
});
