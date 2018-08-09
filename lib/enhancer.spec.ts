import { enhancer } from './enhancer';
import { combineReducers, createStore } from 'redux';

const action = (type: string) => ({ type });

const transitions = {
  'Action A': () => [ 'State A' ],
  'Action B': () => [ 'State B', () => Promise.resolve({ type: 'Action C' }) ],
  'Action C': () => [ 'State C' ],
  'Action D': () => [ 'State D', 'Hello' ],
  'Action E': () => [ 'State E', () => `I'm a string` ],
}

function update(state = null, { type }) {
  return transitions[type] ? transitions[type]() : state;
}

describe('enhancer', () => {
  it('should return a function', () => {
    expect(enhancer(createStore)).toBeInstanceOf(Function)
  });

  it('should enhance the store without throwing', () => {
    expect(() => createStore(combineReducers({ test: ():null => null }), enhancer)).not.toThrow();
  })

  it('should return the state as an object', () => {
    const store = createStore(combineReducers({ update }), enhancer);
    store.dispatch({ type: 'Action A' })
    expect(store.getState()).toMatchObject({ update: 'State A' })
  })

  it('should throw if command is anything, but Function', () => {
    const store = createStore(combineReducers({ update }), enhancer);
    expect(() => store.dispatch({ type: 'Action D' })).toThrow('Command should be a Function')
  });

  it('should throw if command returns to anything but Promise', () => {
    const store = createStore(combineReducers({ update }), enhancer);
    expect(() => store.dispatch({ type: 'Action E' })).toThrow('Command should return a Promise')
  });
});
