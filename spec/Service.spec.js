/* eslint-env jasmine */
const Service = require('../src/Service');
const koa = require('koa');
const app = koa();

class TestService extends Service{}

describe('Service', () => {
  it('.name returns the constructor name', () => {
    const testService = new TestService(app);
    expect(testService.name).toBe('testService');
  });

  it('.name returns the opt.name', () => {
    const s = new Service(app, {name: 'John'});
    expect(s.name).toBe('John');
  });
});
