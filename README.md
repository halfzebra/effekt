# effekt

[Redux](https://redux.js.org/) enhancer for state-driven I/O.

```typescript
type Fetch = { type: 'Fetch', payload: number }

type Fail = { type: 'Fail', payload: string }

type Success = { type: 'Success', payload: string }

type Action = Fetch | Fail | Success

type State = { error: string } | { title: string } | null;

const Success = (payload: string): Success => ({ type: 'Success', payload })

type Command = () => Promise<Fail | Success>

function update(state: State = null, action: Action) : [ State, Command ] | [ State ] {
  switch (action.type) {
    case 'Fetch':

      return [
        state,
        () => fetch(`https://jsonplaceholder.typicode.com/todos/${action.payload}`)
            .then(response => response.json())
            .then(({ title }) => title)
            .then(Success)
      ];
      
    case 'Success':
       return [ { title: action.payload } ]
      
    case 'Fail':
       return [ { error: action.payload } ]
      
    default:
      return  [ state ];
  }
}

const Viewer = ({ state, fetchToDo }) => (
  <>
    { state.error && <p>We have an error!</p> }
    { state.title && <p>{ state.title }</p> }
    <button onClick={() => fetchToDo(1)}>First</button>
    <button onClick={() => fetchToDo(2)}>Second</button>
    <button onClick={() => fetchToDo(3)}>Third</button>
  </>
)
```

[eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise) is a must.
