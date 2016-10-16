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
    const bumps = this.app.context.balls.map(ball => {
      return ball.bump.bind(ball);
    });
    return bumps
      .reduce(
        (previous, current) => previous.then(current),
        Promise.resolve()
      )
      .then(() => {
        // theoretically bumps, might have created more balls,
        // that's why we want to reiterate before we roll
        const rolls = this.app.context.balls.map(ball => ball.roll());
        return Promise.all(rolls);
      });
  }
}

module.exports = CueBall;
