
# Cyclic Example

> Rendered views should be observable, or produce observables

Builds on basic examples by adding a `Channel`, which is simply a cold observable that listens to specific events on a global event emitter. A channel additionally ensures that dispatches are created, ready to be consumed by the intent.
