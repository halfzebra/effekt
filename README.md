# effekt

[Redux](https://redux.js.org/) enhancer for state-driven I/O.

## Motivation

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
      return  [ state ];
  }
}
```

`ToDoViewer.ts`
```typescript
const Viewer = ({ state, Fetch }) => (
  <>
    { state.error && <p>We have an error!</p> }
    { state.title && <p>{ state.title }</p> }
    <button onClick={() => Fetch(1)}>First</button>
    <button onClick={() => Fetch(2)}>Second</button>
    <button onClick={() => Fetch(3)}>Third</button>
  </>
)
```

### JavaScript

[eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise) is a must.

## Acknowledgements

- [redux-loop](https://github.com/redux-loop/redux-loop)
- [redux-observable](https://redux-observable.js.org/)