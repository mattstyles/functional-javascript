
## Model

Holds data about the application. It is mutated within the fold function so any models declared in the application represent the initial state of the model, its current state is held by the fold.

## Signal

Observables that produce arbitrary unstructured events.

## Event

Represents an arbitrary event, effectively a connection with the outside world.

## Intents

Provides structure by mapping signal output into a structured dispatch.

## Action

A discrete key representing an action that occurs during the app lifecycle.

## Payload

Actions can come with their own data.

## Dispatch

A dispatch always consists of an action and a payload. It bubbles along to the fold and is used by update functions to mutate the current state.

## Update

Takes the application model and a dispatch and performs any mutations necessary to update the state.

## Sink

Side effects resulting from application state change, usually responsible for rendering views.
