var locationsMap = require('../config.json').reservesLocations

module.exports = function parseReservesInfo (wmsItem) {
  var entry = wmsItem.entry && wmsItem.entry.length === 1 ? wmsItem.entry[0] : null
  if (!entry) return {}

  var holding = getHolding(entry)

  if (!holding) return {}

  var info = locationsMap[holding.temporaryLocation[0]] || {}

  info['courses'] = extractCourses(holding.note).join('\n')
  info['callNumber'] = extractCallNumber(entry)
  info['oclcNumber'] = extractOCLCNumber(entry.bib)

  return info
}

