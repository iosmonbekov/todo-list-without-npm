import { call, all, select, take, takeEvery, put } from "redux-saga/effects";

// Workers:
function* fetchTodos() {
  try {
    const data = yield call(() => {
      const store = JSON.parse(localStorage.getItem("STORE"));
      return store ? store.todos : [];
    });
    yield put({ type: "TODOS_FETCH_SUCCESS", payload: data });
  } catch (error) {
    yield put({ type: "TODOS_FETCH_ERROR", payload: error.message });
  }
}

function* saveToLS() {
  try {
    while (true) {
      yield take(["ADD_TODO", "REMOVE_TODO", "EDIT_TODO"]);
      const store = yield select((store) => store);
      localStorage.setItem("STORE", JSON.stringify(store));
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Watchers:
function* todosSaga() {
  yield takeEvery("TODOS_FETCH_REQUEST", fetchTodos);
}

// RootSaga:
export function* rootSaga() {
  yield all([todosSaga(), saveToLS()]);
}
