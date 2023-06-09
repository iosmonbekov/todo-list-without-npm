import createSagaMiddleware from "@redux-saga/core";

import { createStore, applyMiddleware, combineReducers } from "./libs/redux";
import { rootSaga } from "./saga";

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

const rootReducer = combineReducers({
  todos: todoReducer,
  error: errorReducer,
});

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger));

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
