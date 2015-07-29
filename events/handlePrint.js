var remote = require('remote')

module.exports = function handlePrint (ev) {
  remote.getCurrentWindow().print()
}