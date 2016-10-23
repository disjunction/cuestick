/* eslint-env jasmine */
const Service = require('../src/Service');
const koa = require('koa');
const app = koa();

class TestService extends Service{}

describe('Service', () => {
  const testService = new TestService(app);
  it('name returns the child name', () => {
    expect(testService.name).toBe('TestService');
  });
});
