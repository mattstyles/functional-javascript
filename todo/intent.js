
const most = require('most')
const {createDispatch} = require('./util')
const ACTION = require('./action')
const {keys} = require('./signals')

const screen = require('./screen')

function navigation (signal) {
  let fullKey = signal
    .map(key => key.key.full)

  let up = fullKey
    .filter(key => key === 'up')
    .map(key => createDispatch(ACTION.NAVIGATE, -1))

  let down = fullKey
    .filter(key => key === 'down')
    .map(key => createDispatch(ACTION.NAVIGATE, 1))

  return most.merge(up, down)
}

function tab (signal) {
  return signal
    .map(key => key.key.full)
    .filter(key => key === 'tab')
    .map(key => createDispatch(ACTION.CHANGE_STATE))
}

function input (signal) {
  let add = signal
    .filter(key => key.key.name !== 'backspace' && key.key.name !== 'return')
    .map(key => key.ch)
    .filter(key => key && /./.test(key))
    .filter(key => !/\t/.test(key))
    .map(key => createDispatch(ACTION.UPDATE, key))

  let back = signal
    .map(key => key.key.full)
    .filter(key => key === 'backspace')
    .map(key => createDispatch(ACTION.UPDATE, -1))

  let enter = signal
    .map(key => key.key.full)
    .filter(key => key === 'return')
    .map(key => createDispatch(ACTION.ADD))

  return most.merge(back, add, enter)
}

function quit (signal) {
  return signal
    .map(key => createDispatch(ACTION.QUIT))
}

module.exports = function intent () {
  let quitStream = keys
    .map(key => key.key.full)
    .filter(key => ['q', 'escape', 'C-c'].includes(key))

  return most.merge(
    quit(quitStream),
    input(keys),
    tab(keys),
    navigation(keys)
  )
}
