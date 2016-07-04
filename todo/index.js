
const Immutable = require('immutable')

const screen = require('./screen')
const view = require('./view')
const intent = require('./intent')
const update = require('./update')

/**
 * Model
 */
const App = new Immutable.Record({
  entries: Immutable.List(),
  field: '',
  index: 0
})

let model = new App()

process.on('error', err => {
  screen.debug(err)
  process.exit(0)
})

/**
 * run
 */
function run (model, update, intent, sink) {
  let previous = model
  let view = sink(previous)
  intent()
    .scan(update, previous)
    .observe(current => {
      view(previous, current)
      previous = current
    }, error => {
      screen.debug(error)
      process.exit(0)
    })
}

run(model, update, intent, view)
