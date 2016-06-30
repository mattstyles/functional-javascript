
# Basic HTTP example

> Models the Signal -> Intent -> Update -> Sink architecture

Builds on the basic countdown example by adding asynchronicity into the mix and also adds the ability to pass values from a signal through to the fold function so that update can perform the mutations.

Introduces the concept of Dispatches.

## Dispatch

Like a dispatch in Flux, a dispatch here is structured to describe the intent being performed along with some data that is unique to that intent. The update function then matches on actions and performs some logic to update the state of the model based on the data it has received from the intent.

## @TODO

Despite using a global key listener from the blessed screen there is still no way for view elements to create observables based on their content i.e. when we crank this up to HTML then the DOM will emit signals based on user actions which we need to be able to handle. Using an event emitter and declaratively binding that when the view renders is an option, but, its going to get messy.

This opens up a discussion about views being observable to allow stuff like component composition.
