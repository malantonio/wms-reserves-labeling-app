module.exports = handleSubmit

var CopyResource = require('oclc-copy-resource')
var WSKey = require('oclc-wskey')
var config = require(__dirname + '/../config.json')

var parseReservesInfo = require(__dirname + '/../lib/parseReservesInfo')
var renderTemplate = require(__dirname + '/../lib/renderTemplate')
var getItemTitle = require(__dirname + '/../lib/getItemTitle')

var key = new WSKey(config.wskey.public, config.wskey.secret, config.wskey.user)
var cr = new CopyResource(config.inst, key)

var elements = require(__dirname + '/../elements')

function handleSubmit (ev) {
  var barcode = elements.inputs.barcode.value
  ev.preventDefault()

  if (!barcode) return
  else return cr.barcode(barcode, handleSearch)

  function handleSearch (err, resp) {
    if (err) return handleErrors(err)
    if (typeof resp === 'string') resp = JSON.parse(resp)

    var reservesInfo = parseReservesInfo(resp)

    if (!reservesInfo.name) return handleErrors(new Error('The item is not on reserve!'))

    if (config.includeTitle) {
      // to get the item title, we need to make _another_ request to OCLC
      getItemTitle(reservesInfo.oclcNumber, function (title) {
        reservesInfo.title = title
        generateLabel(reservesInfo)
      })
    } else {
      generateLabel(reservesInfo)
    }
  }

  function handleErrors (err) {
    var el = elements.feedback.alert
    el.classList.add('alert-error')
    el.innerText = err.message
  }

  function generateLabel (info) {
    var el = elements.containers.label

    el.innerHTML = renderTemplate('label', info)
  }
}
