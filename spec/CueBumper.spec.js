/* eslint-env jasmine */
const CueBumper = require('../src/CueBumper');
const Service = require('../src/Service');
const koa = require('koa');
const R = require('ramda');
const createSpy = jasmine.createSpy;
const delay = require('timeout-as-promise');

describe('CueBumper', () => {
  let services;
  let app;

  beforeEach(() => {
    app = koa();
    services = R.times(id => {
      const service = new Service(app, {name: 'service_' + id});
      service.bump = createSpy();
      service.roll = createSpy();
      return service;
    }, 3);
  });

  it('bump executes bumps and rolls', done => {
    const cueService = new CueBumper(app);
    services.forEach(service => cueService.place(service));
    cueService
      .bump()
      .then(() => {
        services.forEach(service => {
          expect(service.bump).toHaveBeenCalled();
          expect(service.roll).toHaveBeenCalled();
        });
        done();
      })
      .catch(done.fail);
  });

  it('bump fires promisified events', done => {
    const cueService = new CueBumper(app);
    let a = 1;

    cueService.on('cuestick:before:bump', service => {
      if (service.name === 'service_1') {
        return delay(100).then(_ => a++); // delay assignment
      }
      if (service.name === 'service_2') {
        expect(a).toBe(2); // make sure bump service_1 has finished
        cueService.on('blah', done);
      }
    });

    cueService.on('cuestick:after:roll', service => {
      if (service.name === 'service_2') {
        return delay(50).then(cueService.emit('blah'));
      }
    });

    services.forEach(service => cueService.place(service));
    cueService.bump().catch(done.fail);
  });
});
