var remote = require('remote')

module.exports = {
  close: function closeWindow () {
    return remote.getCurrentWindow().close()
  },
  copy: function copy () {
    return remote.getCurrentWindow().webContents.copy()
  },
  cut: function cut () {
    return remote.getCurrentWindow().webContents.cut()
  },
  paste: function paste () {
    return remote.getCurrentWindow().webContents.paste()
  },
  quit: function quitApp () {
    return remote.require('app').quit()
  },
}
