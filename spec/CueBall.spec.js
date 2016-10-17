/* eslint-env jasmine */
const CueBall = require('../src/CueBall');
const Ball = require('../src/Ball');
const koa = require('koa');
const app = koa();
const R = require('ramda');

class TestBall extends Ball{}

describe('CueBall', () => {
  let balls;

  beforeEach(() => {
    balls = R.times(() => {
      const ball = new Ball(app);
      ball.bumpSpy = spyOn(ball, 'bump').and.callThrough();
      ball.rollSpy = spyOn(ball, 'roll').and.callThrough();
      return ball;
    }, 3);
  });

  it('bump executes bumps and rolls', done => {
    const cueBall = new CueBall(app);
    balls.forEach(ball => cueBall.addBall(ball));
    cueBall
      .bump()
      .then(() => {
        balls.forEach(ball => {
          expect(ball.bumpSpy).toHaveBeenCalled();
          expect(ball.rollSpy).toHaveBeenCalled();
        });
        done();
      })
      .catch(done.fail);
  });
});
