import { User } from "firebase/auth";
import { ReactNode, createContext, useContext, useReducer } from "react";

/**
 * Face to frontend, synchronize data on firebase and local data
 */
type AuthActions = {
  type: "sign_in"; // user sign in
  payload: { user: User };
} | {
  type: "sign_out"; // user sign out
}

type AuthState = {
  state: "signed_in";
  user: User;
} | {
  state: "uninitialized";
}

const uninitialized_state: AuthState = { state: "uninitialized" };

const AuthReducer = (
  defaultState: AuthState,
  action: AuthActions
): AuthState => {
  switch (action.type) {
    case "sign_in":
      let user = action.payload.user!
      return { state: "signed_in", user: user };
    case "sign_out":
      return { state: "uninitialized" };
    default:
      return defaultState;
  }
};

type AuthContextProps = {
  state: AuthState;
  dispatch: (value: AuthActions) => void;
};

const uninitialized_context: AuthContextProps = {
  state: uninitialized_state,
  dispatch: () => {},
};

const AuthContext = createContext(uninitialized_context);

const useAuthState = () => {
  const { state } = useContext(AuthContext);
  return { state };
};

const useSignIn = () => {
  const { dispatch } = useContext(AuthContext);
  return {
    signIn: (user: User) => {
      dispatch({ type: "sign_in", payload: { user } });
    },
  };
};

const useSignOut = () => {
  const { dispatch } = useContext(AuthContext);
  return {
    signOut: () => {
      dispatch({ type: "sign_out" });
    },
  };
};

const useUserState = () => {
  return useContext(AuthContext).state
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, uninitialized_state);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, useAuthState, useSignIn, useSignOut, useUserState };
