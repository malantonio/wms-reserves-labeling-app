var fs = require('fs')
var path = require('path')
var _ = require('underscore')

module.exports = function renderTemplate (name, opts, data) {
  if (!data) {
    data = opts
    opts = {}
  }

  var location = opts.templateLocation || path.join(__dirname, '../templates')
  var extension = opts.templateExtension || '.html'
  var file, template, compiled

  file = path.join(location, name + extension)

  template = fs.readFileSync(file, (opts.encoding || 'utf8'))
  compiled = _.template(template)

  return compiled(data)
}
