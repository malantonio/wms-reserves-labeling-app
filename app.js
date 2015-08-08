var app = require('app')
var BrowserWindow = require('browser-window')
var globalShortcut = require('global-shortcut')

var mainWindow = null

app.on('all-windows-closed', function () {
  app.quit()
})

app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 850, height: 700 })

  registerShortcuts(process.platform)

  mainWindow.loadUrl('file://' + __dirname + '/index.html')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})

function registerShortcuts(os) {
  if (!/darwin|win32/i.test(os)) return

  var osKeys = require('./keys/' + os)
  var actions = Object.keys(osKeys)

  actions.forEach(function (action) {
    var keystroke = osKeys[action]

    globalShortcut.register(keystroke, function () {
      mainWindow.webContents.send('shortcut', action)
    })
  })
}