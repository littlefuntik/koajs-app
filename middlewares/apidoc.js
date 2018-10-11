const yaml = require('js-yaml');
const fs = require('fs');
const R = require('ramda');
const tv4 = require('tv4');
const Boom = require('boom');

// TODO: create layout using koa-router for validate request!

async function validateRequest(ctx, next, doc) {
  let path = ctx.request.path;
  let method = ctx.request.method.toLowerCase();
  let type = ctx.request.type;
  const passport = ctx.state._passport.instance;

  // authorization validator:

  await passport.authenticate('jwt', {session: false})(ctx, function () {}); // <- authentication operation
  let security = R.pathOr(null, ['paths', path, method, 'security'], doc);
  if (Array.isArray(security)) {
    let needAuth = security.filter(e => 'bearerAuth' in e).length > 0;
    if (needAuth) {
      // TODO: After complete logic with path params - move authentication operation here.
      if (!ctx.isAuthenticated()) {
        ctx.throw(Boom.unauthorized());
      }
    }
  }

  // request validator:

  let reqSchema = R.pathOr(null, ['paths', path, method, 'requestBody', 'content', type, 'schema'], doc);

  if (reqSchema) {
    let result = tv4.validateMultiple(ctx.request.body, reqSchema);
    if (!result.valid) {
      let message = null;
      if (result.errors.length === 1) {
        message = result.errors[0].message;
      }
      ctx.throw(Boom.badData(message, result.errors));
    }
  }

  // wait
  await next();

  // response validator:

  let resSchema = R.pathOr(null, ['paths', path, method, 'responses', ctx.status, 'content', type, 'schema'], doc);

  if (resSchema) {
    let result = tv4.validateMultiple(ctx.body, resSchema);
    if (!result.valid) {
      let message = null;
      if (result.errors.length === 1) {
        message = result.errors[0].message;
      }
      console.error(result.errors);
      ctx.throw(Boom.badImplementation(message));
    }
  }
}

module.exports = ({file, before}) => {
  let doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
  if (typeof before === 'function') {
    before(doc, tv4);
  }
  return async function (ctx, next) {
    await validateRequest.call(this, ctx, next, doc);
  };
};
