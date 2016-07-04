
/**
 * Models the
 *   Signal -> Intent -> Update -> Sink
 * architecture which models
 *   Event -> Mutation
 *   Input -> Output
 */

'use strict'

const blessed = require('blessed')
const keymirror = require('keymirror')
const most = require('most')
const EventEmitter = require('events')

let screen = blessed.screen({
  title: 'fold/scan test',
  debug: true,
  log: './debug.log'
})

screen.debug('start')

// Action enum
const ACTIONS = keymirror({
  'QUIT': null,
  'KEYDOWN': null
})

function createDispatch (action, payload) {
  return {action, payload}
}

function mapFullKey (keypress) {
  return keypress.key.full
}

/**
 * Event Signals
 */

// Dispatches keypress events
// null -> Cold Signal {Event}
let rawKeypress = most
  .fromEvent('keypress', screen)
  .map(event => {
    return {
      ch: event[0],
      key: event[1]
    }
  })

let keys = rawKeypress
  .map(mapFullKey)

// Source for view observables
let emitter = new EventEmitter()

/**
 * Intents
 * Map event signals into dispatches
 */

// Turns an event into a dispatch
// Signal {Event} -> Signal {Dispatch}
function quit (signal) {
  return signal
    .map(key => createDispatch(ACTIONS.QUIT, null))
}

// Ensures that actions from the source emitter become dispatches
// Signal {Event} -> Signal {Dispatch}
function channel (emitter) {
  let dispatchStream = most
    .fromEvent('dispatch', emitter)

  let actionStream = most
    .fromEvent('action', emitter)
    .map(createDispatch)

  return most.merge(
    dispatchStream,
    actionStream
  )
}

// Creates the intent stream
// null -> Signal {Dispatch}
function intent () {
  let quitStream = keys
    .filter(key => ['escape', 'q', 'C-c'].includes(key))

  return most.merge(
    quit(quitStream),
    channel(emitter)
  )
}

/**
 * Model
 */
let initialModel = `Hit q to quit
Hit s to send an action
Hit d to send a dispatch
Check the debug log for output`

/**
 * Update
 */

// Takes the model and the action
// Model, Dispatch -> Model
function update (model, dispatch) {
  screen.debug(dispatch)
  if (dispatch.action === ACTIONS.QUIT) {
    screen.debug('quitting...')
    process.exit(0)
  }

  if (dispatch.action === ACTIONS.KEYDOWN) {
    screen.debug('keydown:', dispatch.payload)
  }

  return model
}

/**
 * Views
 */

// Create initial view model and returns updater
// Model -> Sink
function view (model) {
  let text = blessed.Text({
    top: 0,
    left: 0,
    width: '100%',
    height: 4,
    content: model
  })
  screen.append(text)
  screen.render()

  keys
    .filter(k => k === 's')
    .observe(key => {
      emitter.emit('action', ACTIONS.KEYDOWN)
    })

  keys
    .filter(k => k === 'd')
    .observe(key => {
      emitter.emit('dispatch', createDispatch(ACTIONS.KEYDOWN, {
        foo: 'foo',
        bar: 'bar'
      }))
    })

  return (previous, current) => {
    text.setContent(current)
    screen.render()
  }
}

/**
 * Main
 */

// This main function passes previous and current to the view function
// so that it can work out how to map from one state to another
function main (model, update, intent, sink) {
  let previous = model
  let view = sink(model)
  intent()
    .scan(update, model)
    .observe(current => {
      view(previous, current)
      previous = current
    })
}

/**
 * Bootstrap
 */

// Go
main(initialModel, update, intent, view)
