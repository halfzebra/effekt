import { enhancer } from './enhancer';
import { combineReducers, createStore } from 'redux';

const action = (type: string) => ({ type });

const transitions = {
  'Action A': () => [ 'State A' ],
  'Action B': () => [ 'State B', () => Promise.resolve({ type: 'Action C' }) ],
  'Action C': () => [ 'State C' ]
}

function reducer(state = null, { type }) {
  return transitions[type] ? transitions[type]() : state;
}

describe('enhancer', () => {
  it('should return a function', () => {
    expect(enhancer(createStore)).toBeInstanceOf(Function)
  });

  it('should enhance the store without throwing', () => {
    expect(() => createStore(combineReducers({ test: () => null }), enhancer)).not.toThrow();
  })

  it('should return the state as an object', () => {
    const store = createStore(combineReducers({ reducer }), enhancer);

    store.dispatch({ type: 'Action A' })

    expect(store.getState()).toMatchObject({ reducer: 'State A' })
  })

  it('should run the command and transition into correct state', () => {
    const store = createStore(combineReducers({ reducer }), enhancer);

    store.dispatch({ type: 'Action B' })

    process.nextTick(() => {
      expect(store.getState()).toMatchObject({ reducer: 'State C' })
    })
  })
});
