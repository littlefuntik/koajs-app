const path = require('path');

module.exports = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  openApi: {
    file: path.join(__dirname, 'open-api.yaml')
  },
  jwt: {
    secret: process.env.JWTSECRET || 'secret string'
  },
  forceSyncDb: !!process.env.DBFORCESYNC,
  db: {
    database: process.env.DBNAME || 'postgres',
    username: process.env.DBUSER || 'postgres',
    password: process.env.DBPASSWORD || '',
    options: {
      host: process.env.DBHOST || 'localhost',
      port: process.env.DBPORT || 5432,
      dialect: process.env.DBDIALECT || 'postgres',
      pool: {
        max: process.env.DBPOOLMAX || 3,
        min: process.env.DBPOOLMIN || 0,
        acquire: 30000,
        idle: 10000
      },
      operatorsAliases: false
    }
  }
};
