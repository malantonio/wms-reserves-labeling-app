var remote = require('remote')

module.exports = {
  close: function closeWindow () {
    remote.getCurrentWindow().close()
    return false
  },
  copy: function copy () {
    remote.getCurrentWindow().webContents.copy()
    return false
  },
  cut: function cut () {
    remote.getCurrentWindow().webContents.cut()
    return false
  },
  paste: function paste () {
    remote.getCurrentWindow().webContents.paste()
    return false
  },
  quit: function quitApp () {
    remote.require('app').quit()
    return false
  },
  devTools: function openDevTools () {
    remote.getCurrentWindow().toggleDevTools()
    return false
  }
}
