var remote = require('remote')
var ipc = require('ipc')
var BrowserWindow = remote.require('browser-window')
var clipboard = require('clipboard')
var elements = require(__dirname + '/elements')

var CourseReserves = require(__dirname + '/lib/CourseReserves')
var renderTemplate = require(__dirname + '/lib/renderTemplate')
var getOpts = require(__dirname + '/lib/getOptions')

var storage = window.localStorage

var config = getOpts()

var settingsWindow = null


document.addEventListener('DOMContentLoaded', focusOnBarcodeInput)
elements.containers.form.addEventListener('submit', handleBarcodeSubmit)
elements.buttons.print.addEventListener('click', handlePrint)
elements.inputs.autoprint.addEventListener('change', handleAutoprintUpdate)
// elements.buttons.settings.addEventListener('click', handleSettingsPage)

ipc.on('shortcut', handleShortcutAction)

function focusOnBarcodeInput () {
  elements.inputs.barcode.focus()
}

function handleAutoprintUpdate (ev) {
  storage.setItem('autoprint', !!ev.target.checked)
}

function handleBarcodeSubmit (ev) {
  var barcodeInput = elements.inputs.barcode
  var barcode = barcodeInput.value
  var alert = elements.feedback.alert
  var autoprint = storage.getItem('autoprint') || false
  var cr = new CourseReserves(getOpts())

  ev.preventDefault()

  // clear out any remnants
  alert.className = 'alert'
  alert.innerHTML = ''
  barcodeInput.value = ''
  elements.containers.label.innerHTML = ''

  elements.containers.debug.innerHTML = 'LOADING'
  cr.handleBarcode(barcode)

  cr.on('ready', function (info) { 
    elements.containers.debug.innerHTML = ''
    elements.containers.label.innerHTML = renderTemplate('label', info)
    
    // pause to let the logo load
    if (autoprint) setTimeout(handlePrint, 50)
  })

  cr.on('error', function (err) {
    var el = elements.feedback.alert
    el.classList.add('alert-error')
    el.innerHTML = err.message
  })
}

// function handleSettingsPage (ev) {
//   ev.preventDefault()
  
//   settingsWindow = new BrowserWindow({width: 600, height: 700, frame: false})
//   settingsWindow.loadUrl('file://' + __dirname + '/settings.html')
//   settingsWindow.on('closed', function () { settingsWindow = null })
// }

function handlePrint (ev) {
  remote.getCurrentWindow().print({silent: !!config.silentPrinting})
}

function handleShortcutAction (action) {
  if (!remote.getCurrentWindow().isFocused()) return

  // if the settings window is open, pass the shortcut to it
  if (settingsWindow !== null && settingsWindow.isFocused()) {
    return settingsWindow.send('shortcut', action)
  }

  var all = require(__dirname + '/lib/shortcut-actions')
  return all[action]()
}
