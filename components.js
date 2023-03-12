function InputForm({ type = "text", initValue = "", onSubmit, shouldFocus = false, placeholder = "" }) {
  const [value, setValue] = React.useState(initValue);
  const ref = React.useRef();

  React.useEffect(() => {
    if (shouldFocus) ref.current.focus();
  }, []);

  const onBeforeSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
  };

  return (
    <form className="form-group" onSubmit={onBeforeSubmit}>
      <input
        ref={ref}
        placeholder={placeholder}
        className="form-control"
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}

function TodoList({ todos = [], onRemove, onEdit }) {
  return (
    <ul className="list-group">
      {todos.map((todo) => (
        <TodoItem todo={todo} onEdit={onEdit} onRemove={onRemove} />
      ))}
    </ul>
  );
}

function TodoItem({ todo, onRemove, onEdit }) {
  const [status, setStatus] = React.useState("READING");

  const onBeforeEdit = (todo) => {
    onEdit(todo);
    setStatus("READING");
  };

  const content = (todo) => {
    switch (status) {
      case "READING":
        return <span>{todo.text}</span>;
      case "EDITING":
        return <InputForm shouldFocus initValue={todo.text} onSubmit={(text) => onBeforeEdit({ text, id: todo.id })} />;
      default:
        break;
    }
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center" key={todo.id}>
      {content(todo)}
      <div>
        <button disabled={status === "EDITING"} onClick={() => setStatus("EDITING")} className="btn btn-primary mx-2">
          <i class="bi bi-pen-fill"></i>
        </button>
        <button onClick={() => onRemove(todo.id)} className="btn btn-danger">
          <i class="bi bi-trash-fill"></i>
        </button>
      </div>
    </li>
  );
}

function ErrorComponent({ error }) {
  const dispatch = ReactRedux.useDispatch();
  const [loader, setLoader] = React.useState(false);

  const reset = () => {
    setLoader(true);

    setTimeout(() => {
      localStorage.clear()
      dispatch({ type: "CLEAN_ERROR" });
    }, 500);
  };

  return (
    <div className="container">
      <h2 className="mt-5">Error: {error}</h2>
      <button disabled={loader} className="btn btn-warning" onClick={reset}>
        {loader ? "Loading..." : "Try again?"}
      </button>
    </div>
  );
}
