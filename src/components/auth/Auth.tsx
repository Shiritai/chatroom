import { User } from "firebase/auth"
import { ReactNode, createContext, useContext, useReducer } from "react"

type AuthActions = {
	type: 'sign_in' | 'sign_out',
	payload: { user: User | null }
}

type AuthState = {
	state: 'signed_in' | 'signed_out' | 'uninitialized',
	user: User | null
}

const uninitialized_state: AuthState = { state: 'uninitialized', user: null }

const AuthReducer = (defaultState: AuthState, action: AuthActions): AuthState => {
	switch (action.type) {
		case 'sign_in':
			return { state: 'signed_in', user: action.payload.user }
		case 'sign_out':
			return { state: 'signed_out', user: null }
		default:
			return defaultState
	}
}

type AuthContextProps = {
	state: AuthState,
	dispatch: (value: AuthActions) => void
}

const uninitialized_context: AuthContextProps = { state: uninitialized_state, dispatch: () => {} }

const AuthContext = createContext(uninitialized_context)

const useAuthState = () => {
	const { state } = useContext(AuthContext)
	return { state }
}

const useSignIn = () => {
	const { dispatch } = useContext(AuthContext)
	return {
		signIn: (user: User) => {
			dispatch({ type: 'sign_in', payload: {user} })
		}
	}
}

const useSignOut = () => {
	const { dispatch } = useContext(AuthContext)
	return {
		signOut: () => {
			dispatch({ type: 'sign_out', payload: { user: null } })
		}
	}
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(AuthReducer, uninitialized_state)
	
	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			{children}
		</AuthContext.Provider>
	)
}

export { AuthContext, AuthProvider, useAuthState, useSignIn, useSignOut }