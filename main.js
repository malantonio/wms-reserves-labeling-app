var remote = require('remote')
var elements = require(__dirname + '/elements')
var CourseReserves = require(__dirname + '/lib/CourseReserves')
var cr = new CourseReserves(config)
var storage = window.localStorage

var renderTemplate = require(__dirname + '/lib/renderTemplate')

document.addEventListener('DOMContentLoaded', focusOnBarcodeInput)
elements.containers.form.addEventListener('submit', handleBarcodeSubmit)
elements.buttons.print.addEventListener('click', handlePrint)
elements.inputs.autoprint.addEventListener('change', handleAutoprintUpdate)

function focusOnBarcodeInput () {
  elements.inputs.barcode.focus()
}

// go into localStorage + retrieve needed values
// or put an error on screen
function getOpts () {
  // return {
  //   'inst': storage.getItem('inst-id'),
  //   'wskey': {
  //     'public': storage.getItem('wskey-public'),
  //     'secret': storage.getItem('wskey-secret')
  //   },
  //   'user': {
  //     'principalID': storage.getItem('principal-id'),
  //     'principalIDNS': storage.getItem('principal-idns')
  //   },
  //   'includeTitle': storage.getItem('include-title')
  // }
  return require(__dirname + '/config.json')
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

function handleOptionsPage (ev) {
  
}

function handlePrint (ev) {
  remote.getCurrentWindow().print({silent: !!config.silentPrinting})
}
