const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const config = require('./config');

const db = require('./storage').connect(config.db);

const logger = require('./middlewares/logger');
const fail = require('./middlewares/fails');
const apiDoc = require('./middlewares/apidoc');
const passport = require('./middlewares/passport')(config.jwt.secret, db.models.User);
const routes = require('./routes');

const app = new Koa();
app.context.db = db;
app.context.config = config;

app.use(logger());
app.use(fail());
app.use(bodyParser());
app.use(passport.initialize());
app.use(apiDoc({
  file: config.openApi.file,
  passport: passport
}));
app.use(routes.api.routes());
app.use(routes.api.allowedMethods());

app.on('close', async function () {
  console.log('Close database connection pool...');
  let db = this.context.db;
  if (db) {
    await db.disconnect();
  }
});

app.startServer = async function () {
  console.log('Create database connection pool...');
  let {db, config} = this.context;
  if (db && config) {
    await db.sync({force: config.forceSyncDb});
  }
  return this.listen(config.port, config.host, listeningReporter);
};

function listeningReporter() {
  const {address, port} = this.address();
  const protocol = this.addContext ? 'https' : 'http';
  console.log(`Listening on ${protocol}://${address}:${port}...`);
}

module.exports = app;
