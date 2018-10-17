const assert = require('assert');
const app = require('../app');
const supertest = require('supertest');

describe('/api', function () {

  let request;

  before(async function () {
    // recreate database
    app.context.db.sync({force: true});
    // start app request client
    request = supertest.agent(app.callback());
  });

  after(async function () {
    // close app
    app.emit('close');
  });

  describe('GET /', function () {
    it('should 404 without routes', function (done) {
      request
        .get('/api')
        .expect(404, done);
    });
  });

  describe('POST /user', function () {
    it('user registration #1', function (done) {
      request
        .post('/api/user')
        .send({email: 'hello1@gmail.com', password: '1234567'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(res.body['id'], 1);
          assert.strictEqual(res.body['email'], 'hello1@gmail.com');
        })
        .expect(200, done);
    });

    it('user registration #2', function (done) {
      request
        .post('/api/user')
        .send({email: 'hello2@gmail.com', password: '1234567'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(res.body['id'], 2);
          assert.strictEqual(res.body['email'], 'hello2@gmail.com');
        })
        .expect(200, done);
    });

    it('Wrong user registration', function (done) {
      request
        .post('/api/user')
        .send({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(422, done);
    });
  });
});
