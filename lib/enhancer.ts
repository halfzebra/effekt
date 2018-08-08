import { StoreCreator } from 'redux';

function log(exp: any) {
  console.log(exp);
  return exp;
}

function isPromise(obj: any) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export function enhancer(createStore: StoreCreator) {
    return function(reducer: any, preloadedState: any) {
      const store = createStore((s, a) => {
        const nextStateWithCommands = reducer(s, a);
        const nextState = {};
        let state;
        let command;
        let promise;

        for (let key in nextStateWithCommands) {
          if (Object.prototype.hasOwnProperty.call(nextStateWithCommands, key)) {
            if (Array.isArray(nextStateWithCommands[key])) {
              if (nextStateWithCommands[key].length === 1) {
                nextState[key] = nextStateWithCommands[key][0];
              } else if (nextStateWithCommands[key].length >= 2) {
                [state, command] = nextStateWithCommands[key];
                nextState[key] = state;

                if (typeof command !== 'function') {
                  throw new Error('Command should be a function')
                }

                promise = command()

                if (!isPromise(promise)) {
                  throw new Error('expected promise')
                }

                promise.then(maybeAction => {
                  if (maybeAction.type) {
                    store.dispatch(maybeAction);
                  }
                })
              }
            } else {
              nextStateWithCommands[key] = nextStateWithCommands;
            }
          }
        }

        return nextState;
      }, preloadedState);

      return store;
    }
}
