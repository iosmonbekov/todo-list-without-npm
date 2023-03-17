import { createContext, useContext, useState } from "react";

const ReduxContext = createContext();

function Provider({ store, children }) {
  const [state, setState] = useState(store.getState());
  return <ReduxContext.Provider value={[store, state, setState]} children={children} />;
}

function useSelector(fn) {
  const [store, state] = useContext(ReduxContext);
  return fn(state);
}

function useDispatch() {
  const [store, state, setState] = useContext(ReduxContext);

  return (action) => {
    store.dispatch(action);
    setState(store.getState());
  };
}

export { Provider, useSelector, useDispatch };
