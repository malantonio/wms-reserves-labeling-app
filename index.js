var remote = require('remote')
var BrowserWindow = remote.require('browser-window')
var elements = require(__dirname + '/elements')
var http = require('http')
var Mousetrap = new (require('mousetrap'))(document)

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

document.addEventListener('DOMContentLoaded', onload)
elements.inputs.autoprint.addEventListener('change', handleAutoprintUpdate)
elements.buttons.print.addEventListener('click', handlePrint)
elements.buttons.clear.addEventListener('click', handleClear)
elements.containers.form.addEventListener('submit', handleBarcodeSubmit)
elements.inputs.manualReservePeriod.addEventListener('change', handleManualPeriodUpdate)

elements.buttons.manual.addEventListener('click', showManualForm)
elements.buttons.manualSubmit.addEventListener('click', manualFormSubmit)
elements.buttons.manualCancel.addEventListener('click', hideManualForm)

function showManualForm () {
  elements.containers.manualForm.classList.add('mf-visible')
}

function hideManualForm () {
  elements.containers.manualForm.classList.remove('mf-visible')
}

function manualFormSubmit () {
  var titleEl = document.querySelector('#mf-title')
  var courseEl = document.querySelector('#mf-number')
  var periodEl = document.querySelector('#mf-period')

  var title = titleEl.value
  var courses = courseEl.value.split(/,\s*/g)
  var period = periodEl.value
  var info = config.reservesLocations[period]
  info.title = title
  info.courses = courses

  courses.forEach(function (course) {
    info.course = course
    addLabelToContainer(info)
  })

  hideManualForm()

  // reset the elements
  titleEl.value = courseEl.value = ''
  periodEl.options[0].selected = true
}

function onload () {
  registerShortcuts()

  // set the autoprint button
  elements.inputs.autoprint.checked = autoprint
  
  // put focus on the barcode input
  elements.inputs.barcode.focus() 

  addManualReserveOptions()
}

function registerShortcuts () {
  Mousetrap.bind('mod+c', shortcutActions.copy)
  Mousetrap.bind('mod+x', shortcutActions.cut)
  Mousetrap.bind('mod+v', shortcutActions.paste)
  Mousetrap.bind(['command+q', 'alt+f4'], shortcutActions.quit)
  Mousetrap.bind(['command+w', 'ctrl+f4'], shortcutActions.close)

  Mousetrap.bind('esc esc', shortcutActions.devTools)

  // Mousetrap, by default, disables shortcuts when in text elements
  // (input, textarea, essentially all areas we'd be using). Returning
  // false in `Mousetrap.stopCallback` allows the callback to be called
  Mousetrap.stopCallback = function () { return false }
}

function addManualReserveOptions () {
  var locations = config.reservesLocations
  var select = elements.inputs.manualReservePeriod

  for (var i in locations) {
    var loc = locations[i]
    var el = document.createElement('option')

    el.innerText = loc.name
    el.value = i
    select.appendChild(el)
  }
}


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
    var labelNum, offsetX, offsetY, latest

    clearDebug()

    info.courses.forEach(function (course) {
      var singleInfo = info
      singleInfo.course = course
      singleInfo.barcode = barcode
      
      addLabelToContainer(singleInfo)
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

function addLabelToContainer (info) {
  var labelContainer = elements.containers.label
  labelContainer.innerHTML += renderTemplate('label', info)

  if (labelContainer.children.length > 1) {
    labelNum = labelContainer.children.length
    latest = labelContainer.lastChild

    latest.style.top = (labelNum * 10) + 'px'
  }
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

function handleClear (ev) {
  var container = elements.containers.label
  ev.preventDefault()

  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
}

function handleManualPeriodUpdate (ev) {
  var val = ev.target.value
  var valEl = document.querySelector('[data-name="'+val+'"]')

  
}

// function sendItemToGoogleDocsServer (item, cb) {
//   cb = cb || function(){}

//   var data = {
//     itemtitle: item.title,
//     shelvinglocation: item.name + 's',
//     barcode: item.barcode,
//     callnumber: item.callNumber,
//     oclcnumber: item.oclcNumber,
//     copytype: (item.barcode.slice(0) === 3 ? 'Library': 'Personal'),
//     notes: 'Added by Reserves Bot!'
//   }

//   if (!config.reservesBot) {
//     return cb()
//   }

//   var postData = JSON.stringify(data)
//   var course = item.course.replace(/(\w{3,})[\s\-]?(\d{3,})(.*)/, '$1-$2')
//   var semester = config.semester
//   var opts = {
//     host: config.reservesBot.url,
//     method: 'POST',
//     port: config.reservesBot.port,
//     path: '/course/' + semester + '/' + course,
//     headers: {
//       'Content-type': 'application/json',
//       'Content-length': postData.length
//     }
//   }
//   var req = http.request(opts)
//   req.write(postData)
//   req.end()
// }
