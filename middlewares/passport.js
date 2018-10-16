const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

/**
 * Login using credentials.
 * @param {Model} user
 * @param {string} email
 * @param {string} password
 * @param {function} done
 * @return {Promise}
 */
async function login(user, email, password, done) {
  try {
    let record = await user.findOne({where: {email}});
    if (record && await record.validatePassword(password)) {
      return done(null, record);
    }
    return done(null, false, {message: 'Incorrect email or password.'});
  } catch (err) {
    return done(err);
  }
}

/**
 * Authenticate.
 * @param {Model} user
 * @param {Object} payload
 * @param {function} done
 */
function auth(user, payload, done) {
  user.findById(payload.id)
  .then(record => done(null, record ? record : false))
  .error(done);
}

/**
 * @param {string} secret
 * @param {Model} user
 * @return {KoaPassport}
 */
function middleware(secret, user) {
  const localStrategy = new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    function (email, password, done) {
      return login(user, email, password, done);
    }
  );

  const jwtStrategy = new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret
    },
    function (payload, done) {
      return auth(user, payload, done);
    }
  );

  passport.use(localStrategy);
  passport.use(jwtStrategy);

  return passport;
}

module.exports = middleware;
