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
        <button onClick={() => setStatus("EDITING")} className="btn btn-primary mx-2">
          <i class="bi bi-pen-fill"></i>
        </button>
        <button onClick={() => onRemove(todo.id)} className="btn btn-danger">
          <i class="bi bi-trash-fill"></i>
        </button>
      </div>
    </li>
  );
}
