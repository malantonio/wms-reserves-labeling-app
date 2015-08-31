module.exports = {
  containers: {
    alert: document.querySelector('.alert-container'),
    debug: document.querySelector('.debug-container'),
    entry: document.querySelector('.entry-container'),
    form: document.querySelector('.barcode-form'),
    label: document.querySelector('.label-target '),
    manualForm: document.querySelector('.manual-form')
  },

  buttons: {
    print: document.querySelector('.print-button'),
    clear: document.querySelector('.clear-button'),
    manual: document.querySelector('.manual-entry'),
    manualSubmit: document.querySelector('.manual-form-submit'),
    manualCancel: document.querySelector('.manual-form-cancel')
  },

  inputs: {
    barcode: document.querySelector('.barcode-input'),
    autoprint: document.querySelector('.autoprint'),

    // manual entry form elements
    manualReservePeriod: document.querySelector('.manual-form-reserve-period')
  },

  feedback: {
    alert: document.querySelector('.alert-container .alert')
  },

  liveLists: {
    labels: document.getElementsByClassName('label')
  },

  // these don't exist yet/anymore 
  settings: {
    wskeyPublic: document.querySelector('#settings-wskey-public'),
    wskeySecret: document.querySelector('#settings-wskey-secret'),
    principalID: document.querySelector('#settings-principal-id'),
    principalIDNS: document.querySelector('#settings-principal-idns'),
    instID: document.querySelector('#settings-inst-id'),
    includeTitle: document.querySelector('#settings-include-title')
  }
}
