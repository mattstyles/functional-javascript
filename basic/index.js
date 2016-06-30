
/**
 * Models the
 *   Signal -> Intent -> Update -> Sink
 * architecture which models
 *   Event -> Mutation
 *   Input -> Output
 */

'use strict'

const blessed = require('blessed')
const {Observable} = require('rx-lite')
const keymirror = require('keymirror')

let screen = blessed.screen({
  title: 'fold/scan test',
  debug: true,
  log: './debug.log'
})

// screen.debug('start')
// screen.render()

// Action enum
const ACTIONS = keymirror({
  'TICK': null,
  'INCREMENT': null,
  'DECREMENT': null,
  'NOOP': null
})

/**
 * Raw producers, Signals?
 */

// Dispatches keypress events
// Signal -> Event
let keys = Observable
  .fromEvent(screen, 'keypress', (ch, key) => {
    return {
      ch,
      key
    }
  })

// Add quit keys
keys
  .map(e => e.key.full)
  .subscribe(key => {
    if (['escape', 'q', 'C-c'].includes(key)) {
      process.exit(0)
    }
  })

// Dispatches every second
// Signal -> Event
let tick = Observable
  .interval(1000)
  // .startWith(0)
  .map(e => 1)

/**
 * Action mappers - also Signals?, maybe Intent would be better?
 * Map raw event producers into actions
 */

// Maps the tick producer into an action
// Event -> Action
function time (stream) {
  return stream
    .map(t => ACTIONS.TICK)
}

// Maps keypresses to actions
// Event -> Action
function input (stream) {
  return stream
    .map(e => e.key.name)
    .map(name => {
      if (name === 'up') {
        return ACTIONS.INCREMENT
      }
      if (name === 'down') {
        return ACTIONS.DECREMENT
      }
      return ACTIONS.NOOP
    })
}

// Merges action-producing streams
// Action -> Action
function action () {
  return Observable
    .merge(
      time(tick),
      input(keys)
    )
}

/**
 * Model
 */
let initialModel = 24

/**
 * Update
 */

// Takes the model and the action
// Model, Action -> Model
function update (model, action) {
  if (action === ACTIONS.TICK) {
    return Math.max(0, model - 1)
  }

  if (action === ACTIONS.INCREMENT) {
    return model + 1
  }

  if (action === ACTIONS.DECREMENT) {
    return Math.max(0, model - 1)
  }

  return model
}

// Takes the merge of the action-producing streams
// and pushes it through the updater
// Action -> Model
function fold (update, model) {
  return action()
    .scan(update, model)
}

/**
 * Views
 */

// Create initial view model and returns updater
// Model -> Sink
function view (initial) {
  let text = blessed.Text({
    top: 0,
    left: 0,
    width: '100%',
    height: 1,
    content: initial + ''
  })
  screen.append(text)
  screen.render()

  return model => {
    // screen.program.move(0, 0)
    // screen.program.write(model < 10 ? ' ' + model : model + '')
    text.setContent(model + '')
    screen.render()
  }
}

/**
 * Main
 */

function main (model, update, view) {
  fold(update, model)
    .subscribe(view(model))
}

// Go
main(initialModel, update, view)
