const ReactRedux = (() => {
    const ReduxContext = React.createContext()

    function Provider({ store, children }) {
        const [state, setState] = React.useState(store.getState())
        return <ReduxContext.Provider value={[store, state, setState]} children={children}/>
    }

    function useSelector(fn) {
        const [store, state] = React.useContext(ReduxContext)
        return fn(state)
    }

    function useDispatch() {
        const [store, state, setState] = React.useContext(ReduxContext)

        return (action) => {
            store.dispatch(action)
            setState(store.getState())
        }
    }

    return {
        Provider,
        useSelector,
        useDispatch,
    }
})()