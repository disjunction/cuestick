class Service {
  constructor(app, opts) {
    this.app = app;

    // if it's express, then create context
    // as if it were koa
    if (!this.app.context) {
      this.app.context = {};
    }

    this.opts = opts || {};
  }

  get name() {
    return this.opts.name || this.constructor.name;
  }
}

module.exports = Service;
