
## Observables

### Cold

Cold observables are global streams used to connect to the outside world, such as input devices (keyboard, touch, mouse etc) or http. Cold observables in this sense traditionally never stop.

### Hot

Used internally to attach and mutate the cold observables; streams within the system are usually hot.

## Primary

### Model

Holds data about the application. It is mutated within the fold function so any models declared in the application represent the initial state of the model, its current state is held by the fold.

### Signal

Observables that produce arbitrary unstructured events.

### Intents

Provides structure by mapping signal output into a structured dispatch.

### Update

Takes the application model and a dispatch and performs any mutations necessary to update the state.

### Sink

Side effects resulting from application state change, usually responsible for rendering views.

## Secondary

### Channel

A channel provides a way for a view to produce events for an observable that streams into intent.

### Dispatch

A dispatch always consists of an action and a payload. It bubbles along to the fold and is used by update functions to mutate the current state.

### Payload

Actions can come with their own data.

### Action

A discrete key representing an action that occurs during the app lifecycle.

### Event

Represents an arbitrary event, effectively a connection with the outside world.
