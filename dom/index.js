
/**
 * Models the
 *   Signal -> Intent -> Update -> Sink
 * architecture which models
 *   Event -> Mutation
 *   Input -> Output
 */

'use strict'

const keymirror = require('keymirror')
const most = require('most')
const EventEmitter = require('events')
const Quay = require('quay')

// Action enum
const ACTIONS = keymirror({
  'QUIT': null,
  'UP': null,
  'DOWN': null
})

// Helpers
function createDispatch (action, payload) {
  return {action, payload}
}

/**
 * Model
 */
let model = 0

/**
 * Event Signals/Sources
 */

// Source for keypresses
let quay = new Quay()

// Source for view observables
let emitter = new EventEmitter()

/**
 * Intents
 * Map event signals into dispatches
 */

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
  return channel(emitter)
}

/**
 * Update
 */

// Takes the model and the action
// Model, Dispatch -> Model
function update (model, dispatch) {
  if (dispatch.action === ACTIONS.UP) {
    return model + 1
  }

  if (dispatch.action === ACTIONS.DOWN) {
    return model - 1
  }

  if (dispatch.action === ACTIONS.RESET) {
    return 0
  }

  return model
}

/**
 * Views
 */

// Create initial view model and returns updater
// Model -> Sink
function view (model) {
  let body = document.createElement('h1')
  let text = document.createElement('span')
  text.innerHTML = 'Count: '
  let span = document.createElement('span')
  span.innerHTML = model
  body.appendChild(text)
  body.appendChild(span)
  document.body.appendChild(body)

  quay.on('<up>', event => {
    emitter.emit('action', ACTIONS.UP)
  })
  quay.on('<down>', event => {
    emitter.emit('action', ACTIONS.DOWN)
  })
  quay.on('<space>', event => {
    emitter.emit('action', ACTIONS.RESET)
  })

  return (previous, current) => {
    console.log('view update', previous, current)
    if (previous !== current) {
      span.innerHTML = current
    }
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
main(model, update, intent, view)
