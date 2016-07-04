
const blessed = require('blessed')

let screen = blessed.screen({
  title: 'todo',
  debug: true,
  log: './debug.log'
})

screen.debug('starting...')

module.exports = screen
