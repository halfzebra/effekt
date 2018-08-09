import { StoreCreator, AnyAction } from 'redux';

function log(exp: any) {
  console.log(exp);
  return exp;
}

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a Promise-like object.
 */
function isPromise(obj: any) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
export default function isPlainObject(obj: any) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}

export function enhancer(createStore: StoreCreator) {
    return function(reducer: any, preloadedState: any) {
      const store = createStore((s, a) => {
        const nextStateWithCommands = reducer(s, a);
        const nextState: any = {};
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
                  throw new Error('Command should be a Function')
                }

                promise = command(s)

                if (!isPromise(promise)) {
                  throw new Error('Command should return a Promise')
                }

                promise
                  .then((maybeAction: AnyAction) => {
                    if (typeof maybeAction.type === 'undefined') {
                      throw new Error(
                        'Actions may not have an undefined "type" property. ' +
                          'Have you misspelled a constant?'
                      )
                    }

                    store.dispatch(maybeAction);
                  })
                  .catch((maybeErrorAction: AnyAction) => {
                    if (typeof maybeErrorAction.type === 'undefined') {
                      throw new Error(
                        'Actions may not have an undefined "type" property. ' +
                          'Have you misspelled a constant?'
                      )
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
