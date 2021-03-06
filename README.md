# ➰ effekt [![Build Status](https://travis-ci.org/halfzebra/effekt.svg?branch=master)](https://travis-ci.org/halfzebra/effekt)

[Redux](https://redux.js.org/) enhancer for state-driven I/O.

## Motivation

_effect_ is an attempt to combine the simplicity of [redux-thunk](https://github.com/reduxjs/redux-thunk) with the potential of [redux-saga](https://github.com/redux-saga/redux-saga).

Created for those, who find the existing solutions for I/O in Redux ecosystem are too dense or too cluttered with unnecessary abstractions.

It leverages the core JavaScript Data Structures and standard language features while tailored to be used with [TypeScript](#typescript)(but it's not a hard requirement).

## Glossary

Command is a function that accepts state and returns a Promise of some asynchronous computation that resolves into an Action.

Update is a reducer that returns a JavaScript array with two items, first representing the next State and the second being the Command.

```typescript
function update<S, A>(state: S, action: A): [ S, S => Promise<A> ] | [  S ]
```

## Usage

### JavaScript

`toDoViewerUpdate.js`
```js

// Actions.
const Fetch = payload => ({ type: 'Fetch', payload })
const Success = payload => ({ type: 'Success', payload })
const Fail = (payload: string): Success => ({ type: 'Fail', payload })

function update(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'Fetch':
      return [
        state,
        () =>
          fetch(`https://jsonplaceholder.typicode.com/todos/${payload}`)
            .then(response => response.json())
            .then(({ title }) => title)
            .then(Success)
            .catch(({ message}) => Fail(message))
      ];
      
    case 'Success':
       return [ { title: payload } ]
      
    case 'Fail':
       return [ { error: payload } ]
      
    default:
      return [ state ]
  }
}
```

[eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise) with [`"catch-or-return"`](https://github.com/xjamundx/eslint-plugin-promise/blob/master/docs/rules/catch-or-return.md) and [`"always-return"`](https://github.com/xjamundx/eslint-plugin-promise/blob/master/docs/rules/always-return.md) rules are very helpful.

### TypeScript

`toDoViewerUpdate.ts`
```typescript

// Actions.
type Fetch = { type: 'Fetch', payload: number }
type Fail = { type: 'Fail', payload: string }
type Success = { type: 'Success', payload: string }

type Action = Fetch | Fail | Success

const Fetch = (payload: number): Fetch => ({ type: 'Fetch', payload })
const Success = (payload: string): Success => ({ type: 'Success', payload })
const Fail = (payload: string): Fail => ({ type: 'Fail', payload })

// State machine definition.
type State = { error: string } | { title: string } | null;

type Command = () => Promise<Success | Fail>

// Update function that combines the traditional reducer and asynchronous command.
function update(state: State = null, action: Action) : [ State, Command ] | [ State ] {
  const { type, payload } = action;
  switch (type) {
    case 'Fetch':
      return [
        state,
        () =>
          fetch(`https://jsonplaceholder.typicode.com/todos/${payload}`)
            .then(response => response.json())
            .then(({ title }) => title)
            .then(Success)
            .catch(({ message }) => Fail(message))
      ];
      
    case 'Success':
       return [ { title: payload } ]
      
    case 'Fail':
       return [ { error: payload } ]
      
    default:
      return [ state ]
  }
}
```

`ToDoViewer.ts`
```typescript
const Viewer = ({ state, Fetch }) => (
  <React.Fragment>
    { state.error && <p>We have an error!</p> }
    { state.title && <p>{ state.title }</p> }
    <button onClick={() => Fetch(1)}>First</button>
    <button onClick={() => Fetch(2)}>Second</button>
    <button onClick={() => Fetch(3)}>Third</button>
  </React.Fragment>
)
```

## Acknowledgements

- [The Elm Architecture](https://guide.elm-lang.org/architecture/)
- [redux-loop](https://github.com/redux-loop/redux-loop)
- [redux-observable](https://redux-observable.js.org/)
- [redux-saga](https://github.com/redux-saga/redux-saga)
- [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)
- [redux-thunk](https://github.com/reduxjs/redux-thunk)
- [react-redux-typescript-guide](https://github.com/piotrwitek/react-redux-typescript-guide)
