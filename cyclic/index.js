
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
const axios = require('axios')

let screen = blessed.screen({
  title: 'fold/scan test',
  debug: true,
  log: './debug.log'
})

screen.debug('start')

// Action enum
const ACTIONS = keymirror({
  'REFRESH': null,
  'REQ_SUCCESS': null,
  'REQ_FAIL': null,
  'QUIT': null
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
// null -> Signal {Event}
let keys = Observable
  .fromEvent(screen, 'keypress', (ch, key) => {
    return {
      ch,
      key
    }
  })

// Turn basic http request into a stream
// String -> Signal {Event}
function http (url) {
  return Observable
    .fromPromise(axios.get(url))
}

// Accepts an initiator stream and a url to request against,
// returns a stream with the response data
// Signal | String -> Signal {Event}
function request (keypress, url) {
  return keypress
    .map(key => url)
    .flatMapLatest(http)
}

/**
 * Intents
 * Map event signals into dispatches
 */

// Accepts an initiator streams and a url to request against,
// outputs a string
// Signal | String -> Signal {Dispatch}
function nameIntent (signal, url) {
  return request(signal, url)
    .map(res => res.data.name)
    .map(name => createDispatch(ACTIONS.REQ_SUCCESS, name))
    .merge(signal.map(e => createDispatch(ACTIONS.REFRESH, null)))
}

function quit (signal) {
  return signal
    .map(key => createDispatch(ACTIONS.QUIT, null))
}

// Creates the name intent observable
// null -> Signal {Dispatch}
function intent () {
  let fullKeys = keys
    .map(mapFullKey)

  let refreshStream = fullKeys
    .filter(key => key === 'r')

  let quitStream = fullKeys
    .filter(key => ['escape', 'q', 'C-c'].includes(key))

  return Observable.merge(
    nameIntent(refreshStream, 'http://uinames.com/api'),
    quit(quitStream)
  )
}

/**
 * Model
 */
let initialModel = 'Hit \'r\' to request a new name'

/**
 * Update
 */

// Takes the model and the action
// Model, Action -> Model
function update (model, dispatch) {
  if (dispatch.action === ACTIONS.QUIT) {
    screen.debug('quitting...')
    process.exit(0)
  }

  if (dispatch.action === ACTIONS.REFRESH) {
    return 'Refreshing...'
  }

  if (dispatch.action === ACTIONS.REQ_SUCCESS) {
    return dispatch.payload
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
    height: 1,
    content: model
  })
  screen.append(text)
  screen.render()

  return (previous, current) => {
    screen.debug(previous, ':', current)
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
    .subscribe(current => {
      view(previous, current)
      previous = current
    })
}

/**
 * Bootstrap
 */

// Go
main(initialModel, update, intent, view)
