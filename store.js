const DEFAULT_TODO_REDUCER_STATE = JSON.parse(localStorage.getItem('STORE') ?? []);

function todoReducer(state = DEFAULT_TODO_REDUCER_STATE, action) {
  switch (action.type) {
    case "SET_TODOS":
      return [...action.payload];
    case "ADD_TODO":
      return [...state, action.payload];
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload)
    case 'EDIT_TODO': 
      const index = state.findIndex((todo) => todo.id === action.payload.id)
      state.splice(index, 1, action.payload) 
      return [...state]
    default:
      return state;
  }
}

const store = Redux.createStore(todoReducer, Redux.applyMiddleware(Middleware.saverLS, Middleware.logger));
