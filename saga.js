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

// Watchers:
function* todosSaga() {
  yield ReduxSaga.effects.takeEvery("TODOS_FETCH_REQUEST", fetchTodos);
}

// RootSaga:
function* rootSaga() {
  yield ReduxSaga.effects.all([todosSaga()]);
}
