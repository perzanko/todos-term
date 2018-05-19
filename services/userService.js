const username = require('git-user-name')

module.exports = {
  get username() {
    return username() || 'unknown';
  }
}