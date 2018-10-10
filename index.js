const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const config = require('./config');

const db = require('./models')(config.db.database, config.db.username, config.db.password, config.db.options);
db.sequelize.sync({force: config.forceSyncDb});

const logger = require('./middlewares/logger');
const fail = require('./middlewares/fails');
const apiDoc = require('./middlewares/apidoc');
const passport = require('./middlewares/passport')(config.jwt.secret, db.user);
const authOnly = passport.authenticate('jwt', {session: false});
const routes = require('./routes');

const app = new Koa();
const router = new Router();

router.post('/api/user', ctx => {
  return routes.apiUserCreate(db.user, ctx);
});
router.post('/api/login', (ctx, done) => {
  return routes.apiLogin(passport, config.jwt.secret, ctx, done);
});
router.get('/api/deal', authOnly, (ctx, done) => {
  return routes.apiDeals(db.deal, ctx, done);
});
router.post('/api/deal', authOnly, (ctx, done) => {
  return routes.apiDealCreate(db.user, db.deal, db.dealActivity, ctx, done);
});
router.post('/api/deal/:dealId/accept', authOnly, (ctx, done) => {
  return routes.apiDealAccept(db.deal, db.dealActivity, ctx, done);
});
router.get('/api/deal/:dealId/activity', authOnly, (ctx, done) => {
  return routes.apiDealActivities(db.deal, db.dealActivity, ctx, done);
});
router.post('/api/deal/:dealId/activity', authOnly, (ctx, done) => {
  return routes.apiDealActivityCreate(db.user, db.deal, db.dealActivity, ctx, done);
});

config.env !== config.envProduction && app.use(logger());
app.use(fail());
app.use(bodyParser());
app.use(passport.initialize());
app.use(apiDoc(config.openApi.file));
app.use(router.routes());
app.use(router.allowedMethods());

let server = app.listen(config.port, config.host, listeningReporter);

function listeningReporter () {
  const { address, port } = this.address();
  const protocol = this.addContext ? 'https' : 'http';
  console.log(`Listening on ${protocol}://${address}:${port}...`);
}

module.exports = server;
