/**
 * mutate app if needed, so that it fits
 * into cuestick app strucutr expectations
 */
function normalizeApp(app) {
  if (!app.context) {
    app.context = {};
  }
}

/**
 * lowercase first character
 */
function lcfirst(str) {
  if (!str.length) {
    return str;
  }
  return str.charAt(0).toLowerCase() + str.slice(1);
}

module.exports = {
  lcfirst,
  normalizeApp
};
