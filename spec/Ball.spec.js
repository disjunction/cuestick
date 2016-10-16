/* eslint-env jasmine */
const Ball = require('../src/Ball');
const koa = require('koa');
const app = koa();

class TestBall extends Ball{};
describe('Ball', () => {
  const testBall = new TestBall(app);

  it('name returns the child name', () => {
    expect(testBall.name).toBe('TestBall');
  });

  
});
