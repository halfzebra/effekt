# effekt

[Redux](https://redux.js.org/) enhancer for state-driven I/O.

```js
const t = (state, command) => ({ state, command })

function update(state, action) {
  switch (action.type) {
    case 'Fetch':
      return t(
        state,
        () =>
          fetch(`https://jsonplaceholder.typicode.com/todos/${action.payload}`)
            .then(response => response.json())
            .then(payload => ({ type: 'Success', payload }))
            .catch(error => ({ type: 'Fail', error }))
      );
      
    case 'Success':
       return t({ todo: action.payload })
      
    case 'Fail':
       return t({ error: action.error })
      
    default:
      return state;
  }
}

const Viewer = ({ state, fetchToDo }) => (
  <>
    { state.error && <p>We have an error!</p> }
    { state.todo && <p>{ state.todo.title }</p> }
    <button onClick={() => fetchToDo(1)}>First</button>
    <button onClick={() => fetchToDo(2)}>Second</button>
    <button onClick={() => fetchToDo(3)}>Third</button>
  </>
)
```

[eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise) is a must.
