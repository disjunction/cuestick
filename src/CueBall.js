const Ball = require('./Ball');
const R = require('ramda');
const co = require('co');

class CueBall extends Ball {
  addBall(ball) {
    if (!this.app.context.balls) {
      this.app.context.balls = [];
    }
    if (typeof ball === 'string') {
      ball = require(ball);
    }
    if (typeof ball === 'function') {
      ball = new ball(this.app);
    }
    this.app.context.balls.push(ball);
    return this;
  }

  validateBump() {
    if (!this.app.context.balls) {
      this.throw(500, 'cueball has no balls to bump');
    }
  }

  bump() {
    this.validateBump();
    const balls = this.app.context.balls;
    return balls
      .reduce(
        (acc, current) => acc.then(() => current.bump()),
        Promise.resolve()
      )
      .then(
        () => Promise.all(balls.map(ball => ball.roll()))
      );
  }
}

module.exports = CueBall;
