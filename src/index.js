import { createRoot } from "react-dom/client";
import { useEffect } from "react";

import { InputForm, ErrorComponent, TodoList, TodoItem } from "./components.js";
import { useSelector, useDispatch, Provider } from "./libs/react-redux.js";
import { store } from "./store";

function App() {
  const todos = useSelector((state) => state.todos);
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "TODOS_FETCH_REQUEST", payload: "here" });
  }, [error]);

  const createTodo = (text) => {
    dispatch({ type: "ADD_TODO", payload: { id: Date.now(), text } });
  };

  const removeTodo = (id) => {
    dispatch({ type: "REMOVE_TODO", payload: id });
  };

  const editTodo = (todo) => {
    dispatch({ type: "EDIT_TODO", payload: todo });
  };

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div className="container p-2">
      <h1>Todo-list</h1>
      <InputForm placeholder="Enter todo..." onSubmit={createTodo} />
      <div className="mt-3">
        {todos.length ? (
          <TodoList todos={todos} onRemove={removeTodo} onEdit={editTodo} />
        ) : (
          <p className="text-center">No todos yet :/</p>
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.querySelector("#root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
