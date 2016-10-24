/* eslint-env jasmine */
const helper = require('../src/helper');

describe('helper', () => {
  it('lcfirst("") works', () => {
    expect(helper.lcfirst('')).toBe('');
  });

  it('normalizeApp() works', () => {
    const app = {};
    helper.normalizeApp(app);
    expect(app.context).toBeDefined();
  });
});
