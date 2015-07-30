module.exports = {
  containers: {
    alert: document.querySelector('.alert-container'),
    debug: document.querySelector('.debug-container'),
    entry: document.querySelector('.entry-container'),
    form: document.querySelector('.barcode-form'),
    label: document.querySelector('.label-target ')
  },

  buttons: {
    print: document.querySelector('.print-button')
  },

  inputs: {
    barcode: document.querySelector('.barcode-input'),
    autoprint: document.querySelector('.autoprint')
  },

  feedback: {
    alert: document.querySelector('.alert-container .alert')
  }

  options: {
    wskeyPublic: document.querySelector('#opts-wskey-public'),
    wskeySecret: document.querySelector('#opts-wskey-secret'),
    principalID: document.querySelector('#opts-principal-id'),
    principalIDNS: document.querySelector('#opts-principal-idns'),
    instID: document.querySelector('#opts-inst-id'),
    includeTitle: document.querySelector('#opts-include-title')
  }
}
