
const screen = require('./screen')
const ACTION = require('./action')

let cachedIndex = 1

function toggleState (index) {
  let newIndex = index === 0 ? cachedIndex : 0
  cachedIndex = index > 0 ? index : 1
  return newIndex
}

function removeLast (str) {
  return str.substr(0, str.length - 1)
}

function clamp (num, min, max) {
  return num < min ? min : num > max ? max : num
}

module.exports = function update (model, dispatch) {
  screen.debug(dispatch)
  if (dispatch.action === ACTION.QUIT) {
    screen.debug('quitting...')
    process.exit(0)
  }

  if (dispatch.action === ACTION.CHANGE_STATE) {
    return model.set('index', toggleState(model.get('index')))
  }

  if (dispatch.action === ACTION.NAVIGATE) {
    let clamped = clamp(
      model.index + dispatch.payload,
      0,
      model.get('entries').size
    )
    return model.set('index', clamped)
  }

  if (dispatch.action === ACTION.ADD) {
    if (model.get('field') === '') {
      return model
    }
    return model.merge({
      'entries': model.entries.push(model.get('field')),
      'field': ''
    })
  }

  if (dispatch.action === ACTION.UPDATE) {
    if (dispatch.payload === -1) {
      screen.debug('backspacing...')
      return model.set('field', removeLast(model.get('field')))
    }
    return model.set('field', model.get('field') + dispatch.payload)
  }

  return model
}
