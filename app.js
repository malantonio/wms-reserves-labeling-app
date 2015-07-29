var app = require('app')
var BrowserWindow = require('browser-window')

var mainWindow = null

app.on('all-windows-closed', function () {
  app.quit()
})

app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 850, height: 600 })

  // mainWindow.openDevTools()
  // mainWindow.toggleDevTools()
  mainWindow.loadUrl('file://' + __dirname + '/index.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})
