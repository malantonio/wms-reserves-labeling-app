module.exports = {
  containers: {
    alert: document.querySelector('.alert-container'),
    debug: document.querySelector('.debug-container'),
    entry: document.querySelector('.entry-container'),
    form: document.querySelector('.barcode-form'),
    label: document.querySelector('.label-target ')
  },

  buttons: {
    print: document.querySelector('.print-button'),
    settings: document.querySelector('.settings-button'),
    settingsClose: document.querySelector('.settings-close')
  },

  inputs: {
    barcode: document.querySelector('.barcode-input'),
    autoprint: document.querySelector('.autoprint')
  },

  feedback: {
    alert: document.querySelector('.alert-container .alert')
  },

  settings: {
    wskeyPublic: document.querySelector('#settings-wskey-public'),
    wskeySecret: document.querySelector('#settings-wskey-secret'),
    principalID: document.querySelector('#settings-principal-id'),
    principalIDNS: document.querySelector('#settings-principal-idns'),
    instID: document.querySelector('#settings-inst-id'),
    includeTitle: document.querySelector('#settings-include-title')
  },

  liveLists: {
    labels: document.getElementsByClassName('label')
  }
}
