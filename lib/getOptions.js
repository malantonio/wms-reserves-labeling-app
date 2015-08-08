module.exports = function getOpts () {
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
  return require(__dirname + '/../config.json')
}
