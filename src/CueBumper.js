const {EventEmitter} = require('events');
const helper = require('./helper');

class CueBumper extends EventEmitter {
  constructor(app, opts) {
      super();
      helper.normalizeApp(app);
      this.app = app;
      this.opts = opts || {};
  }

  /**
   * promisified variation of EventEmitter.emit()
   * @return {Promise}
   */
  emit(eventName) {
    return this.listeners(eventName).reduce((acc, listener) => {
      return acc.then(() => listener(...Array.prototype.slice.call(arguments, 1)));
    }, Promise.resolve());
  }

  /**
   * make a Service from given function,
   * which can be a function or a Service-class
   * @param {Function} Service
   * @return {Service}
   */
  makeService(Service) {
    return new Service(this.app);  // eslint-disable-line
  }

  place(service) {
    if (Array.isArray(service)) {
      service.forEach(subService => this.place(subService));
      return this;
    }
    if (!this.app.context.services) {
      this.app.context.services = [];
    }
    if (typeof service === 'string') {
      service = require(service);
    }
    if (typeof service === 'function') {
      service = this.makeService(service);
    }
    this.app.context.services.push(service);
    return this;
  }

  validateBump() {
    if (!this.app.context.services) {
      this.throw(500, 'CueBumper has no services to bump');
    }
  }

  bump() {
    this.validateBump();
    const services = this.app.context.services;

    const maybeCall = (service, name) => {
      return typeof service[name] === 'function'
        ? service[name]() : null;
    };

    return services
      .reduce(
        (acc, service) => acc
          .then(_ => this.emit('cuestick:before:bump', service))
          .then(_ => maybeCall(service, 'bump'))
          .then(_ => this.emit('cuestick:after:bump', service)),
        this.emit('cuestick:finish:place')
      )
      .then(_ => this.emit('cuestick:finish:bump'))
      .then(
        _ => Promise.all(services.map(
            service => Promise.resolve()
              .then(_ => this.emit('cuestick:before:roll', service))
              .then(_ => maybeCall(service, 'roll'))
              .then(_ => this.emit('cuestick:after:roll', service))
          )
        )
      )
      .then(_ => this.emit('cuestick:finish:roll'));
  }
}

module.exports = CueBumper;
