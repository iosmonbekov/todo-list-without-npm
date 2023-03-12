const Redux = (() => {
  function createStore(reducer, enhancer) {
    if (typeof enhancer === "function") return enhancer(createStore)(reducer);

    let state = reducer(undefined, {})
    let subscriptions = [];

    return {
        dispatch(action) {
            state = reducer(state, action)
            subscriptions.forEach((fn) => fn())
        },
        subscribe(fn) {
            subscriptions.push(fn)
            return () => {
                const index = subscriptions.indexOf(fn)
                subscriptions = subscriptions.splice(index, 1)
            }
        },
        getState() {
            return state
        },
    }
  }

  function applyMiddleware(...fns) {
    return (createStore) => {
      return (reducer) => {
        const store = createStore(reducer);

        for (const fn of fns.reverse()) {
            store.dispatch = fn(store)(store.dispatch)
        }

        return store
      };
    };
  }

  function combineReducers(reducers) {
    return (state = {}, action) => {
        for (const key in reducers) {
            state[key] = reducers[key](state[key], action)
        }
        return state
    }
  }

  return { createStore, applyMiddleware, combineReducers };
})();


// Middlewares:
const Middleware = (() => {
    function logger(store) {
        return (next) => {
            return (action) => {
                console.log('Action: ', action.type)
                next(action)
                console.log('State: ', store.getState())
            }
        }
    }

    function saverLS(store) {
      return (next) => {
        return (action) => {
          next(action)
          localStorage.setItem('STORE', JSON.stringify(store.getState()))
        }
      }
    } 

    return { logger, saverLS }
})()
