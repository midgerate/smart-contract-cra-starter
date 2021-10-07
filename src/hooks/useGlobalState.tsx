import { createContext, useCallback, useContext, useReducer } from 'react'

const GlobalStateContext = createContext<any[]>([])

const initialState = { loggedInUser: null }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GlobalStateReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_LOGGED_IN_USER':
      return {
        ...state,
        loggedInUser: action.user,
      }
    default:
      return state
  }
}

export const GlobalStateProvider: React.FC = ({ children }): JSX.Element => {
  const [state, dispatch] = useReducer(GlobalStateReducer, initialState)

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalStateContext.Provider>
  )
}

const useGlobalState = (): {
  loggedInUser: any
  setLoggedInUser: (user: any) => void
} => {
  const [state, dispatch] = useContext(GlobalStateContext)

  const setLoggedInUser = useCallback(
    (user: any) => {
      dispatch({ type: 'SET_LOGGED_IN_USER', user })
    },
    [dispatch]
  )

  return {
    loggedInUser: state.loggedInUser,
    setLoggedInUser,
  }
}

export default useGlobalState
