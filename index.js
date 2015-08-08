var remote = require('remote')
var ipc = require('ipc')
var BrowserWindow = remote.require('browser-window')
var elements = require(__dirname + '/elements')

var CourseReserves = require(__dirname + '/lib/CourseReserves')
var renderTemplate = require(__dirname + '/lib/renderTemplate')
var config = require(__dirname + '/lib/getConfig')()

var shortcutActions = require(__dirname + '/lib/shortcut-actions')

// printing options
var storage = window.localStorage
var sAutoprint = storage.getItem('autoprint')
var autoprint = sAutoprint === "false" || sAutoprint === null ? false : true
var silentPrinting = !!config.silentPrinting

// print queue controls
var labelList = elements.liveLists.labels
var printIntervalLength = 1000
var printQueueActive = false
var printIntervalId

document.addEventListener('DOMContentLoaded', setAutoprintButton)
document.addEventListener('DOMContentLoaded', focusOnBarcodeInput)
elements.inputs.autoprint.addEventListener('change', handleAutoprintUpdate)
elements.buttons.print.addEventListener('click', handlePrint)
elements.containers.form.addEventListener('submit', handleBarcodeSubmit)

ipc.on('shortcut', handleShortcutAction)

function setAutoprintButton () {
  elements.inputs.autoprint.checked = autoprint
}

function focusOnBarcodeInput () { elements.inputs.barcode.focus() }

function handleAutoprintUpdate (ev) { 
  var checked = !!ev.target.checked

  autoprint = checked
  storage.setItem('autoprint', checked)
}

function clearDebug () { elements.containers.debug.innerHTML = '' }

function handleBarcodeSubmit (ev) {
  var barcodeInput = elements.inputs.barcode
  var barcode = barcodeInput.value
  var alert = elements.feedback.alert
  var cr = new CourseReserves(config)

  ev.preventDefault()

  // clear out any remnants
  alert.className = 'alert'
  alert.innerHTML = ''
  barcodeInput.value = ''
  //elements.containers.label.innerHTML = ''

  elements.containers.debug.innerHTML = 'LOADING'
  cr.handleBarcode(barcode)

  cr.on('data', function (info) { 
    var labelContainer = elements.containers.label
    var labelNum, offsetX, offsetY, latest

    clearDebug()

    info.courses.forEach(function (course) {
      var singleInfo = info
      singleInfo.course = course
      elements.containers.label.innerHTML += renderTemplate('label', info)
    
      if (labelContainer.children.length > 1) {
        labelNum = labelContainer.children.length
        latest = labelContainer.lastChild

        latest.style.top = (labelNum * 10) + 'px'
      }
    })  

    // pause to let the logo load
    if (autoprint) setTimeout(handlePrint, 50)
  })

  cr.on('error', function (err) {
    var el = elements.feedback.alert
    clearDebug()
    el.classList.add('alert-error')
    el.innerHTML = err.message
  })
}

function handleShortcutAction (action) {
  if (!remote.getCurrentWindow().isFocused()) return

  return shortcutActions[action]()
}

function handlePrint () {
  // kick starts the printQueue if it's inactive
  if (labelList.length > 0) {
    printIntervalId = setInterval(handlePrintQueue, printIntervalLength)
  }

  function handlePrintQueue () {
    var list = labelList

    if (list.length === 0) {
      return clearInterval(printIntervalId)
    }

    var el = list[0]
    
    el.classList.add('print-visible')

    // let's do some printing
    remote.getCurrentWindow().print({silent: silentPrinting})
    
    // give the print-signal a chance
    setTimeout(function () {
      el.classList.add('removed')
      el.addEventListener('transitionend', clearLabelAndReset)
    }, 0)
  }

  function clearLabelAndReset (ev) {
    var target = ev.target
    var parent = target.parentNode

    parent.removeChild(target)

    for (var i = 0; i < labelList.length; i++) {
      var el = labelList[i]
      var newPos = (i * 10) + 'px'
      el.style.top = newPos
    }
  }
}
