const helper = require('./helper');
class Service {
  constructor(app, opts) {
    helper.normalizeApp(app);
    this.app = app;
    this.opts = opts || {};
  }

  get name() {
    return this.opts.name || helper.lcfirst(this.constructor.name);
  }
}

module.exports = Service;
