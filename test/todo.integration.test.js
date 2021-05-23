"use strict";

const request = require('supertest');
require('../server.js');

const api = request('http://localhost:3000');

const chai = require('chai');
const expect = chai.expect;

const validate = require('./validate');

describe('Todo CRUD integration testing', () => {
  describe('/POST save a new todo', () => {
    it('should be able to save a new todo', (done) => {
      var newTodo = {todo: 'New Todo'};
      api.post('/api/todos')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(newTodo)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          // expect(res.body).to.have.property('status');
          // expect(res.body.status).to.not.equal(null);
          // expect(res.body.todo).to.be.a('object');
          // expect(res.body.todo).to.have.property('todo');
          // expect(res.body.todo.todo).to.not.equal(null);
          // expect(res.body.todo).to.have.property('completed');
          // expect(res.body.todo.completed).to.not.equal(null);

          expect(validate.response({
            path: '/todos',
            method: 'post',
            status: '201',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.true;
          done();
        });
    });

    it('missing required property should return a 400 with status as false', (done) => {
      var newTodo = {task: 'New Todo'};
      api.post('/api/todos')
         .set('Accept', 'application/json')
         .set('Content-Type', 'application/json')
         .send(newTodo)
         .expect('Content-Type', /json/)
         .expect(400)
         .end((err, res) => {
            if (err) return done(err);

            expect(validate.response({
              path: '/todos',
              method: 'post',
              status: '400',
              value: res.body
            })).to.be.null;

            expect(res.body.status).to.be.false;
            done();
          });
    });
  });

  describe('/GET fetch all todos', () => {

    it('should return a 200 response with status as true', (done) => {
			api.get('/api/todos')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
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

    it('should return a 400 with status as false', (done) => {
      api.get('/api/todos')
        .query({ status: 'aaaa' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
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
      .expect('Content-Type', /json/)
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
        const all = new Set(res.body.todo.map(todo => todo.completed));
        expect([...all]).to.eql([true]);

        done();
      });
    });
  });

  describe('/GET/:id fetch a todo by id', () => {
    let response = {};

    before((done) => {
      const newTodo = {todo: 'Todo from hooks'};
      api.post('/api/todos')
         .set('Accept', 'application/json')
         .set('Content-Type', 'application/json')
         .send(newTodo)
         .expect(201)
         .end((err, res) => {
           if (err) return done(err);

           response = res.body;
           done();
          });
    });

    it('should return a 200 response with status as true', (done) => {
			api.get(`/api/todos/${response.todo.id}`)
         .set('Accept', 'application/json')
         .expect('Content-Type', /json/)
			   .expect(200)
         .end((err, res) => {
          if (err) return done(err);

          expect(validate.response({
            path: '/todos/{id}',
            method: 'get',
            status: '200',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.true;
          expect(res.body.todo.id).to.eql(response.todo.id);

          done();
        });
		});

    it('should return a 400 response with status as false', (done) => {
      api.get('/api/todos/aaaaa')
         .set('Accept', 'application/json')
         .expect('Content-Type', /json/)
			   .expect(400)
         .end((err, res) => {
          if (err) return done(err);

          expect(validate.response({
            path: '/todos/{id}',
            method: 'get',
            status: '400',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.false;
          done();
         });
    });

    it('should return a 404 response with status as false', (done) => {
      api.get('/api/todos/123456789009876543211234')
         .set('Accept', 'application/json')
         .expect('Content-Type', /json/)
			   .expect(404)
         .end((err, res) => {
          if (err) return done(err);

          expect(validate.response({
            path: '/todos/{id}',
            method: 'get',
            status: '404',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.false;
          done();
         });
    });
  });

  describe('/PATCH/:id update a todo', () => {
    let response = {};

    before((done) => {
      const newTodo = {todo: 'Todo from hooks'};
      api.post('/api/todos')
         .set('Accept', 'application/json')
         .set('Content-Type', 'application/json')
         .send(newTodo)
         .expect(201)
         .end((err, res) => {
          if (err) return done(err);

           response = res.body;
           done();
          });
    });

    it('should be able to update a todo using id with status true', (done) => {
      const updatedTodo = {completed: true};
      api.patch(`/api/todos/${response.todo.id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(updatedTodo)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(validate.response({
            path: '/todos/{id}',
            method: 'patch',
            status: '200',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.true;
          expect(res.body.todo.completed).to.be.true;

          done();
        });
    });

    it('should return a 400 response with status as false', (done) => {
      const updatedTodo = {completed: true};
      api.patch('/api/todos/aaaaa')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(updatedTodo)
        .expect('Content-Type', /json/)
			  .expect(400)
        .end((err, res) => {
          if (err) return done(err);

          expect(validate.response({
            path: '/todos/{id}',
            method: 'patch',
            status: '400',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.false;
          done();
        });
    });

    it('should return a 404 response with status as false', (done) => {
      const updatedTodo = {completed: true};
      api.patch('/api/todos/123456789009876543211234')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(updatedTodo)
        .expect('Content-Type', /json/)
			  .expect(404)
        .end((err, res) => {
          if (err) return done(err);

          expect(validate.response({
            path: '/todos/{id}',
            method: 'patch',
            status: '404',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.false;
          done();
        });
    });
  });

  describe('/DELETE/:id delete a todo', () => {
    let response = {};

    before((done) => {
      const newTodo = {todo: 'Todo from hooks'};
      api.post('/api/todos')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(newTodo)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

           response = res.body;
          done();
        });
    });

    it('should be able to delete a todo', (done) => {
      api.delete(`/api/todos/${response.todo.id}`)
        .set('Accept', 'application/json')
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.noContent).to.be.true;
          done();
        });
    });

    it('should return a 400 response with status as false', (done) => {
      const updatedTodo = {completed: true};
      api.delete('/api/todos/aaaaa')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
			  .expect(400)
        .end((err, res) => {
          if (err) return done(err);

          expect(validate.response({
            path: '/todos/{id}',
            method: 'delete',
            status: '400',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.false;
          done();
        });
    });

    it('should return a 404 response with status as false', (done) => {
      api.delete('/api/todos/123456789009876543211234')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
			  .expect(404)
        .end((err, res) => {
          if (err) return done(err);

          expect(validate.response({
            path: '/todos/{id}',
            method: 'patch',
            status: '404',
            value: res.body
          })).to.be.null;

          expect(res.body.status).to.be.false;
          done();
        });
    });
  });
});
