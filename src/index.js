const CueBumper = require('./CueBumper');

function cuestickFactory(app) {
  return new CueBumper(app);
}

Object.assign(
  cuestickFactory,
  {
    Service: require('./Service'),
    CueBumper: CueBumper
  },
  require('./helper')
);

module.exports = cuestickFactory;
