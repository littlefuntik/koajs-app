module.exports = {
  apiLogin: require('./api/login'),
  apiUserCreate: require('./api/user/create'),
  apiDeals: require('./api/deal/index'),
  apiDealCreate: require('./api/deal/create'),
  apiDealAccept: require('./api/deal/accept'),
  apiDealActivities: require('./api/deal/activity/index'),
  apiDealActivityCreate: require('./api/deal/activity/create'),
};
