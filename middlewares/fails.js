const Boom = require('boom');
const Sequelize = require('sequelize');

function transformData(statusCode, data) {
  if (statusCode === 422 && Array.isArray(data)) {
    data = data.map(item => {
      let field = item.field;

      if (item instanceof Sequelize.ValidationErrorItem) {
        field = item.path;
      }

      if (!field && typeof item.dataPath === 'string') {
        field = item.dataPath.split('/').filter(e => e !== '/' && e.trim() !== '').join('.');
      }

      if (!field && item.params && typeof item.params.key === 'string') {
        field = item.params.key;
      }

      return {
        message: item.message,
        field: field || null
      };
    });
  }

  return data || undefined;
}

async function handleEx(ctx, next) {
  try {
    await next();
    if (ctx.status === 401) {
      ctx.body = Boom.unauthorized(ctx.message).output.payload;
    }
  } catch (ex) {
    let options = {};
    if (ex instanceof Sequelize.ValidationError) {
      ex.data = ex.errors;
      options.statusCode = 422;
    }
    ex = ex ? Boom.boomify(ex, options) : Boom.notFound();
    ex.output.payload.data = transformData(ex.output.statusCode, ex.data);
    ctx.status = ex.output.statusCode;
    ctx.body = ex.output.payload;
  }
}

module.exports = () => handleEx;
