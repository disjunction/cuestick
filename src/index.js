const CueService = require('./CueService');

function factory(app) {
  return new CueService(app);
}

Object.assign(factory, {
  Service: require('./Service'),
  CueService: CueService
});

module.exports = factory;
