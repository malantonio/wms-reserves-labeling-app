var remote = require('remote')
var elements = require(__dirname + '/elements')
var CourseReserves = require(__dirname + '/lib/CourseReserves')
var config = require(__dirname + '/config.json')
var cr = new CourseReserves(config)

var renderTemplate = require(__dirname + '/lib/renderTemplate')

document.addEventListener('DOMContentLoaded', focusOnBarcodeInput)
elements.containers.form.addEventListener('submit', handleBarcodeSubmit)
elements.buttons.print.addEventListener('click', handlePrint)

function focusOnBarcodeInput () {
  elements.inputs.barcode.focus()
}

function handleBarcodeSubmit (ev) {
  var barcodeInput = elements.inputs.barcode
  var barcode = barcodeInput.value
  var alert = elements.feedback.alert
  var autoprint = !!elements.inputs.autoprint.checked

  ev.preventDefault()

  // clear out any remnants
  alert.className = 'alert'
  alert.innerHTML = ''
  barcodeInput.value = ''
  elements.containers.label.innerHTML = ''

  elements.containers.debug.innerHTML = 'LOADING'
  cr.handleBarcode(barcode)

  cr.on('searching', function () {
  })

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

function handlePrint (ev) {
  remote.getCurrentWindow().print({silent: !!config.silentPrinting})
}
