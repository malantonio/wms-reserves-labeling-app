var options = require('./elements').options
var elementList = Object.keys(options)
var storage = window.localStorage
var forEach = Array.prototype.forEach

Array.prototype.forEach.call(elementList, function (k) {
  options[k].addEventListener('blur', handleUpdate)
})

document.addEventListener('DOMContentLoaded', function (ev) {
  forEach.call(elementList, function (e) {
    var el = options[e]
    var key = generateStorageKey(el)
    
    if (el.type === 'checkbox') {
      el.checked = (storage.getItem(key) === 'on')
    } else {
      el.value = storage.getItem(key)
    }
  })
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
  return el.id.replace('opts-', '')
}
