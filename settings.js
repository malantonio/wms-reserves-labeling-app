var remote = require('remote')
var ipc = require('ipc')
var elements = require(__dirname + '/elements')
var settings = elements.settings
var elementList = Object.keys(settings)
var storage = window.localStorage
var forEach = Array.prototype.forEach

var closeButton = elements.buttons.settingsClose

closeButton.addEventListener('click', function (ev) {
  ev.preventDefault()
  remote.getCurrentWindow().close()
})

Array.prototype.forEach.call(elementList, function (k) {
  settings[k].addEventListener('blur', handleUpdate)
})

document.addEventListener('DOMContentLoaded', function (ev) {
  forEach.call(elementList, function (e) {
    var el = settings[e]
    var key = generateStorageKey(el)
    
    if (el.type === 'checkbox') {
      el.checked = (storage.getItem(key) === 'on')
    } else {
      el.value = storage.getItem(key)
    }
  })
})

ipc.on('shortcut', function (action) {
  var all = require(__dirname + '/lib/shortcut-actions')
  return all[action]()
})

function handleUpdate (ev) {
  var el = ev.target
  var val = el.value
  var key = generateStorageKey(el)
  var group = el.parentElement

  group.classList.remove('ok')
  storage.setItem(key, val)
  group.classList.add('ok')
}

// produce an element's localStorage key
function generateStorageKey (el) {
  return el.id.replace('settings-', '')
}
