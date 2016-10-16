class Ball {
  constructor(app, opts) {
    this.app = app;
    this.opts = opts || {};
  }

  get name() {
    return this.opts.name || this.constructor.name;
  }

  bump() {}
  roll() {}
}

module.exports = Ball;
