
'use strict'

const blessed = require('blessed')
const {Observable} = require('rx-lite')

let screen = blessed.screen({
  title: 'fold/scan test',
  debug: true,
  log: './debug.log'
})

screen.debug('start')
screen.render()

let keys = Observable
  .fromEvent(screen, 'keypress', (ch, key) => {
    return {
      action: 'keypress',
      payload: {ch, key}
    }
  })

keys.subscribe(event => {
  if (event.payload.key.name === 'escape') {
    process.exit(0)
  }
})

let time = Observable
  .interval(1000)
  .startWith(0)
  .map(e => {
    return {
      action: 'tick',
      payload: 1
    }
  })

let record = {
  count: 1
}
// let tick = time
//   .scan((prev, next) => {
//     return prev + next
//   }, record)

let model = Observable.merge(
  time,
  keys
)
  // .scan((prev, next) => {
  //   return Object.assign(prev, next)
  // }, record)

// function update (model, observable, fn) {
//   observable
//     .subscribe(event => {
//       model = fn(event, model)
//     }, err => {
//       console.error(err)
//     })
// }
//
// function tick (event, model) {
//   let mutation = Object.assign(model, {
//     count: event + model.count
//   })
//   console.log('model:', mutation)
//   return mutation
// }
//
// function keyHandler (event) {
//   if (event.ch === 'q' || event.key.name === 'escape') {
//     process.exit(0)
//   }
//   console.log(event)
// }
//
// update(record, time, tick)
// update(null, keys, keyHandler)

// function tick (model) {
//   return model +
// }

function fold () {
  return (prev, next) => {
    return Object.assign(prev, next)
  }
}

let view = model
  .filter(event => event.action === 'tick')
  .scan(fold(), model)
  .subscribe(event => {
    console.log('tick', event.payload)
  })
