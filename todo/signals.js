
const most = require('most')
const screen = require('./screen')

exports.keys = most
  .fromEvent('keypress', screen)
  .map(event => {
    return {
      ch: event[0],
      key: event[1]
    }
  })
