function todoReducer(state = [], action) {
  switch (action.type) {
    case "TODOS_FETCH_SUCCESS":
      return [...action.payload];
    case "ADD_TODO":
      return [...state, action.payload];
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "EDIT_TODO":
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state.splice(index, 1, action.payload);
      return [...state];
    default:
      return state;
  }
}

function errorReducer(state, action) {
  switch (action.type) {
    case "TODOS_FETCH_ERROR":
      return action.payload;
    case "CLEAN_ERROR":
      return null;
    default:
      return state;
  }
}

const rootReducer = Redux.combineReducers({
  todos: todoReducer,
  error: errorReducer,
});

const sagaMiddleware = ReduxSaga.default();

const store = Redux.createStore(
  rootReducer,
  Redux.applyMiddleware(sagaMiddleware, saveToLS(["ADD_TODO", "REMOVE_TODO", "EDIT_TODO"]), logger)
);

sagaMiddleware.run(rootSaga);

// middlewares:
function logger(store) {
  return (next) => {
    return (action) => {
      console.log("Action: ", action.type);
      next(action);
      console.log("State: ", store.getState());
    };
  };
}

function saveToLS(actions) {
  return (store) => {
    return (next) => {
      return (action) => {
        next(action);
        if (actions.includes(action.type)) {
          localStorage.setItem("STORE", JSON.stringify(store.getState()));
        }
      };
    };
  };
}
