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
    it('should 404', function (done) {
      request
        .get('/api')
        .expect(404, done);
    });
  });

  describe('POST /user', function () {
    it('sign up t1@example.com', function (done) {
      request
        .post('/api/user')
        .send({email: 't1@example.com', password: '1234567'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(res.body['id'], 1);
          assert.strictEqual(res.body['email'], 't1@example.com');
        })
        .expect(200, done);
    });

    it('sign up t2@example.com', function (done) {
      request
        .post('/api/user')
        .send({email: 't2@example.com', password: '1234567'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(res.body['id'], 2);
          assert.strictEqual(res.body['email'], 't2@example.com');
        })
        .expect(200, done);
    });

    it('sign up validation', function (done) {
      request
        .post('/api/user')
        .send({email: 't3', password: ''})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(422, done);
    });
  });

  describe('POST /login', function () {
    it('sign in t1@example.com', function (done) {
      request
      .post('/api/login')
      .send({email: 't1@example.com', password: '1234567'})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(function(res) {
        assert.strictEqual(typeof res.body['token'] === 'string', true);
      })
      .expect(200, done);
    });

    it('sign in validation', function (done) {
      request
      .post('/api/login')
      .send({email: 'ghost@example.com', password: '1234567'})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
    });
  });

  describe('POST /deal', function () {
    describe('To accept the offer', function () {
      let bearerToken1, bearerToken2, dealId;

      it('Login t1@example.com', function (done) {
        request
        .post('/api/login')
        .send({email: 't1@example.com', password: '1234567'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(typeof res.body['token'] === 'string', true);
          bearerToken1 = res.body['token'];
        })
        .expect(200, done);
      });

      it('Login t2@example.com', function (done) {
        request
        .post('/api/login')
        .send({email: 't2@example.com', password: '1234567'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function (res) {
          assert.strictEqual(typeof res.body['token'] === 'string', true);
          bearerToken2 = res.body['token'];
        })
        .expect(200, done);
      });

      it('User t1@example.com create proposition', function (done) {
        request
        .post('/api/deal')
        .send({receiver: 2, message: 'I have proposition.', price: 50})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', bearerToken1)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(typeof res.body['id'], 'number');
          dealId = res.body['id'];
        })
        .expect(200, done);
      });

      it('User t2@example.com answer', function (done) {
        request
        .post(`/api/deal/${dealId}/activity`)
        .send({message: 'No', price: 40})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', bearerToken2)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(typeof res.body['id'], 'number');
          assert.strictEqual(typeof res.body['message'], 'string');
          assert.strictEqual(res.body['message'], 'No');
        })
        .expect(200, done);
      });

      it('User t1@example.com accept', function (done) {
        request
        .post(`/api/deal/${dealId}/accept`)
        .send({message: 'Ok'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', bearerToken1)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(typeof res.body['id'], 'number');
          assert.strictEqual(typeof res.body['message'], 'string');
          assert.strictEqual(res.body['message'], 'Ok');
        })
        .expect(200, done);
      });

      it('Check accepted', function (done) {
        request
        .get(`/api/deal/${dealId}`)
        .set('Accept', 'application/json')
        .set('Authorization', bearerToken1)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(res.body['closed'], true);
          assert.strictEqual(res.body['finalPrice'], '40.00');
        })
        .expect(200, done);
      });
    });

    describe('To decline the offer', function () {
      let bearerToken1, bearerToken2, dealId;

      it('Login t1@example.com', function (done) {
        request
        .post('/api/login')
        .send({email: 't1@example.com', password: '1234567'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(typeof res.body['token'] === 'string', true);
          bearerToken1 = res.body['token'];
        })
        .expect(200, done);
      });

      it('Login t2@example.com', function (done) {
        request
        .post('/api/login')
        .send({email: 't2@example.com', password: '1234567'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function (res) {
          assert.strictEqual(typeof res.body['token'] === 'string', true);
          bearerToken2 = res.body['token'];
        })
        .expect(200, done);
      });

      it('User t1@example.com create proposition', function (done) {
        request
        .post('/api/deal')
        .send({receiver: 2, message: 'I have proposition.', price: 50})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', bearerToken1)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(typeof res.body['id'], 'number');
          dealId = res.body['id'];
        })
        .expect(200, done);
      });

      it('User t2@example.com answer', function (done) {
        request
        .post(`/api/deal/${dealId}/activity`)
        .send({message: 'No', price: 40})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', bearerToken2)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(typeof res.body['id'], 'number');
          assert.strictEqual(typeof res.body['message'], 'string');
          assert.strictEqual(res.body['message'], 'No');
        })
        .expect(200, done);
      });

      it('User t1@example.com decline', function (done) {
        request
        .post(`/api/deal/${dealId}/activity`)
        .send({message: 'No', price: -1})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', bearerToken1)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(typeof res.body['id'], 'number');
          assert.strictEqual(typeof res.body['message'], 'string');
          assert.strictEqual(res.body['message'], 'No');
        })
        .expect(200, done);
      });

      it('Check declined', function (done) {
        request
        .get(`/api/deal/${dealId}`)
        .set('Accept', 'application/json')
        .set('Authorization', bearerToken1)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          assert.strictEqual(res.body['closed'], true);
          assert.strictEqual(res.body['finalPrice'], null);
        })
        .expect(200, done);
      });
    });
  });
});
