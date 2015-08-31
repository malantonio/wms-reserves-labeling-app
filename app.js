var app = require('app')
var BrowserWindow = require('browser-window')
var globalShortcut = require('global-shortcut')

var mainWindow = null

app.on('all-windows-closed', function () {
  app.quit()
})

app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 850, height: 700 })

  // mainWindow.openDevTools()

  mainWindow.loadUrl('file://' + __dirname + '/index.html')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
})
