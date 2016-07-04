
const blessed = require('blessed')
const screen = require('./screen')

let text = blessed.Text({
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  border: {
    type: 'line',
    fg: 'white'
  },
  label: ' What needs to be done? '
})

let list = blessed.List({
  top: 3,
  left: 0,
  width: '100%',
  height: 15,
  border: {
    type: 'line',
    fg: 'white'
  },
  style: {
    item: {
      fg: 'white'
    },
    selected: {
      bg: 'black'
    }
  },
  label: ' Todos '
})

function update (prev, curr) {
  screen.debug(prev, ':', curr)
  if (curr.index === 0) {
    text.style.border.fg = 'green'
    list.style.border.fg = 'white'
    list.style.selected.bg = 'black'
  } else {
    text.style.border.fg = 'white'
    list.style.border.fg = 'green'
    list.style.selected.bg = 'grey'
    list.select(curr.index - 1)
  }

  if (prev.field !== curr.field) {
    text.setContent(curr.field)
  }

  if (!prev.entries.equals(curr.entries)) {
    list.setItems(curr.entries.toJS())
  }

  screen.render()
}

module.exports = function view (model) {
  text.setContent(model.field)
  list.setItems(model.entries.toJS())

  screen.append(text)
  screen.append(list)
  screen.render()

  return update
}
