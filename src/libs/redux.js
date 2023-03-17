function createStore(reducer, enhancer) {
  if (typeof enhancer === "function") return enhancer(createStore)(reducer);

  let state = reducer(undefined, {});
  let subscriptions = [];

  return {
    dispatch(action) {
      state = reducer(state, action);
      subscriptions.forEach((fn) => fn());
    },
    subscribe(fn) {
      subscriptions.push(fn);
      return () => {
        const index = subscriptions.indexOf(fn);
        subscriptions = subscriptions.splice(index, 1);
      };
    },
    getState() {
      return state;
    },
  };
}

function applyMiddleware(...fns) {
  return (createStore) => {
    return (reducer) => {
      const store = createStore(reducer);

      for (const fn of fns.reverse()) {
        store.dispatch = fn(store)(store.dispatch);
      }

      return store;
    };
  };
}

function combineReducers(reducers) {
  return (state = {}, action) => {
    for (const key in reducers) {
      state[key] = reducers[key](state[key], action);
    }
    return { ...state };
  };
}

export { createStore, applyMiddleware, combineReducers };
