// Workers:
function* fetchTodos() {
  try {
    const data = yield ReduxSaga.effects.call(() => {
      const store = JSON.parse(localStorage.getItem("STORE"));
      return store ? store.todos : [];
    });
    yield ReduxSaga.effects.put({ type: "TODOS_FETCH_SUCCESS", payload: data });
  } catch (error) {
    yield ReduxSaga.effects.put({ type: "TODOS_FETCH_ERROR", payload: error.message });
  }
}

function* saveToLS() {
  try {
    while(true) {
      yield ReduxSaga.effects.take(["ADD_TODO", "REMOVE_TODO", "EDIT_TODO"])
      const store = yield ReduxSaga.effects.select(store => store)
      localStorage.setItem('STORE', JSON.stringify(store))
    }
  } catch (error) {
    console.error(error.message)
  }
}

// Watchers:
function* todosSaga() {
  yield ReduxSaga.effects.takeEvery("TODOS_FETCH_REQUEST", fetchTodos);
}

// RootSaga:
function* rootSaga() {
  yield ReduxSaga.effects.all([todosSaga(), saveToLS()]);
}
