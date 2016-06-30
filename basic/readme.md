
# Countdown

> Models the Signal -> Intent -> Update -> Sink architecture

Uses blessed as a rendering and user interface layer.

## Structures

### Actions

The actions enum collects all possible actions that can stream through the application.

### Signals

Signals refer to raw observables. These can be anything that emits events through the stream. Signals, by convention, should remain fairly minimal i.e. emit whatever the event source emits. They output an unknown and inconsistent event structure, it is the responsibility of signal intents to map these to actions.

### Intents

Intents are domain-specific and map arbitrary event signatures into whatever actions the domain specifies.

### Update

The update function is passed to a fold function and is responsible for changing the state in the stream to another state. It should return a new state which is passed through the stream to consumers (usually views).

### Sink

Views are sinks, they take a model and render it.

## TODO

* The architecture here is purely dependent on a global manager, the blessed screen, to work. Views that create observables are ignored as there is no way to merge that observable back into the architecture.

* Signals and intents currently turn arbitrary events into actions (and only actions), however, this restriction simplifies the abstraction but means that the update function can not respond to parameters to the events being created. There needs to be a way to pass parameters along with actions.
