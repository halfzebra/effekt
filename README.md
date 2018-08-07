# effekt

[Redux](https://redux.js.org/) enhancer for state-driven I/O.

## Motivation

This library is created for those, who find the existing solutions too heavy or too cluttered with unnecessary abstractions.

It leverages the core JavaScript Data Structures and starndard language features and tailored to be used with TypeScript(but it's not a hard requirement).

## Usage

### TypeScript

`toDoViewerUpdate.ts`
```typescript

// Actions.
type Fetch = { type: 'Fetch', payload: number }
type Fail = { type: 'Fail', payload: string }
type Success = { type: 'Success', payload: string }

type Action = Fetch | Fail | Success

const Fetch = (payload: number): Success => ({ type: 'Fetch', payload })
const Success = (payload: string): Success => ({ type: 'Success', payload })
const Fail = (payload: string): Success => ({ type: 'Fail', payload })

// State machine definition.
type State = { error: string } | { title: string } | null;

type Command = () => Promise<Fail | Success>

// Update function that combines the traditional reducer and asynchronous command.
function update(state: State = null, action: Action) : [ State, Command ] | [ State ] {
  const { type, payload } = action;
  switch (type) {
    case 'Fetch':
      return [
        state,
        () => fetch(`https://jsonplaceholder.typicode.com/todos/${payload}`)
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
      return  [ state ]
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

### JavaScript

[eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise) with [`"catch-or-return"`](https://github.com/xjamundx/eslint-plugin-promise/blob/master/docs/rules/catch-or-return.md) rule enabled is a must.

## Acknowledgements

- [redux-loop](https://github.com/redux-loop/redux-loop)
- [redux-observable](https://redux-observable.js.org/)
- [redux-saga](https://github.com/redux-saga/redux-saga)
- [redux-thunk](https://github.com/reduxjs/redux-thunk)