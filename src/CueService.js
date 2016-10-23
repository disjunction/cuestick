const Service = require('./Service');

class CueService extends Service {
  /**
   * make a Service from given function,
   * which can be a function or a Service-class
   * @param {Function} Service
   * @return {Service}
   */
  makeService(Service) {
    return new Service(this.app);  // eslint-disable-line
  }

  push(service) {
    if (Array.isArray(service)) {
      service.forEach(subService => this.push(subService));
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
      this.throw(500, 'CueService has no services to bump');
    }
  }

  bump() {
    this.validateBump();
    const services = this.app.context.services;

    function maybeCall(service, name) {
      return typeof service[name] === 'function'
        ? service[name]() : null;
    }

    return services
      .reduce(
        (acc, service) => acc.then(_ => maybeCall(service, 'bump')),
        Promise.resolve()
      )
      .then(
        _ => Promise.all(services.map(service => maybeCall(service, 'roll')))
      );
  }
}

module.exports = CueService;
