// http://www.worldcat.org/webservices/catalog/content/{oclc}?wskey={wskey}
var http = require('http')
var wcUrl = 'http://www.worldcat.org/webservices/catalog/content/'
var wskey = require('../config.json').wskey.public
var xml = require('node-xml')

module.exports = function getItemTitle (oclcNumber, callback) {
  var url = wcUrl + oclcNumber + '?wskey=' + wskey

  http.get(url, function (res) {
    var body = ''
    res.setEncoding('utf8')

    res.on('data', function (chunk) {
      body += chunk
    })

    res.on('end', function () {
      if (res.statusCode !== 200) return ''
      else return parseMarcTitle(body, callback)
    })
  })
}

function parseMarcTitle (marc, cb) {
  var Parser = new xml.SaxParser(function (p) {
    p.onStartElementNS(handleStartElement)
    p.onEndElementNS(closeOutTitleField)
    p.onCharacters(appendTitle)
  })
  var title = ''
  var isTitleField = false
  var atTitle = false

  function handleStartElement (el, attrs) {
    var i = 0
    var key, val

    // this could be cleaned up
    if (isTitleField && el === 'subfield') {
      for (; i < attrs.length; i++) {
        key = attrs[i][0]
        val = attrs[i][1]

        if (key === 'code' && val === 'a') {
          atTitle = true
          return
        }
      }
    } else {
      for (; i < attrs.length; i++) {
        key = attrs[i][0]
        val = attrs[i][1]

        if (key === 'tag' && parseInt(val, 10) === 245) {
          isTitleField = true
          return
        }
      }
    }
  }

  function appendTitle (text) {
    if (isTitleField && atTitle) {
      title += text
      atTitle = false
    }
  }

  function closeOutTitleField (el) {
    if (isTitleField && el === 'datafield') {
      isTitleField = false
    }
  }

  Parser.parseString(marc)

  return cb(title.trim().replace(/\s+\/$/, ''))
}
