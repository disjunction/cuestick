/* eslint-env jasmine */
const CueService = require('../src/CueService');
const Service = require('../src/Service');
const koa = require('koa');
const app = koa();
const R = require('ramda');
//const jasmine = require('jasmine/lib/jasmine');
const createSpy = jasmine.createSpy;

describe('CueService', () => {
  let services;

  beforeEach(() => {
    services = R.times(() => {
      const service = new Service(app);
      service.bump = createSpy();
      service.roll = createSpy();
      return service;
    }, 3);
  });

  it('bump executes bumps and rolls', done => {
    const cueService = new CueService(app);
    services.forEach(service => cueService.push(service));
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
});
