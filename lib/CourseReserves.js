module.exports = CourseReserves

var util = require('util')
var events = require('events')

var WSKey = require('oclc-wskey')
var CopyResource = require('oclc-copy-resource')

var getItemTitle = require(__dirname + '/getItemTitle')

util.inherits(CourseReserves, events.EventEmitter)

function CourseReserves (opts) {
  this._user = opts.user
  this._inst = opts.inst
  this._wskey = new WSKey(opts.wskey.public, opts.wskey.secret, this._user)
  this._copyResource = new CopyResource(this._inst, this._wskey)
  this._locations = opts.reservesLocations
  this._includeTitle = opts.includeTitle !== undefined ? opts.includeTitle : false

  events.EventEmitter.call(this)
}

CourseReserves.prototype.handleBarcode = function handleBarcode (barcode) {
  var self = this

  self.emit('searching')  
  
  return this._copyResource.barcode(barcode, function handleCopyResource (err, resp) {
    var errMsg

    if (err) return self.emit('error', err)

    if (typeof resp === 'string') resp = JSON.parse(resp)
    var entry = (resp.entry && resp.entry.length === 1) ? resp.entry[0] : null
    
    if (!entry) {
      if (resp.entry && resp.entry.length > 1) {
        errMsg = 'Multiple items found for this barcode'
        return self.emit('error', new Error(errMsg))
      } 

      else {
        errMsg = 'No item found for this barcode'
        return self.emit('error', new Error(errMsg))
      }
    }
  
    var holdingInfo = getHoldingInfo(entry, self._locations)

    if (!holdingInfo) {
      errMsg = 'Could not find a holding on the provided Reserves shelves'
      return self.emit('error', new Error(errMsg))
    }

    // getHoldingInfo checks for our temp locations, so this already exists
    var tempLocation = holdingInfo.temporaryLocation[0]

    // grab reserves info from w/in our locations object
    var info = self._locations[tempLocation]

    // append some extra info
    info['courses'] = extractCourses(holdingInfo.note)
    info['callNumber'] = extractCallNumber(entry)
    info['oclcNumber'] = extractOCLCNumber(entry.bib)

    if (info.courses.length === 0) {
      errMsg = 'Could not find a Public note containing a course number'
      return self.emit('error', errMsg)
    }

    if (!this._includeTitle) {
      self.emit('getting-title')
      return getItemTitle(info.oclcNumber, function (title) {
        info['title'] = title
        return self.emit('data', info)
      })
    } else {
      return self.emit('data', info)
    }

  })

}

function getHoldingInfo (entry, locations) {
  var locs = Object.keys(locations)
  var i, h

  for (i = 0; i < entry.holding.length; i++) {
    h = entry.holding[i]

    if (h.temporaryLocation && locs.indexOf(h.temporaryLocation[0]) > -1) {
      return h
    }
  }

  return null
}

function extractCallNumber (entry) {
  var sd = entry.shelvingDesignation
  return [
    sd.prefix.join(' '),
    sd.information,
    sd.itemPart.join(' '),
    sd.suffix
  ].join(' ').trim()
}

// course is stored in a public note
function extractCourses (notes) {
  var courseReg = /[A-Z]{3}[\-|\s][0-9]{3}/
  var courses = []

  notes.forEach(function (note) {
    if (note.type === 'PUBLIC' && courseReg.test(note.value)) {
      courses.push(note.value)
    }
  })

  return courses
}

function extractOCLCNumber (entryBib) {
  var reg = /^\/bibs\/(\d+)/
  var match = entryBib.match(reg)

  return match ? match[1] : null
}
