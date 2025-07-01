import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import AuthService from "../services/auth";
import LocalStorageService from "../services/localStorage";

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Actions
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  UPDATE_USER: "UPDATE_USER",
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload.user,
      };

    default:
      return state;
  }
}

// Context
const AuthContext = createContext();

// Provider
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = AuthService.isAuthenticated();
        if (isAuth) {
          const user = AuthService.getCurrentUser();
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: { error: error.message },
        });
      }
    };

    checkAuth();
  }, []);

  // Função de login com useCallback
  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const result = await AuthService.login(credentials);

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.user },
        });
        return { success: true, message: result.message };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: { error: result.message },
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      return { success: false, message: error.message };
    }
  }, []);

  // Função de registro com useCallback
  const register = useCallback(async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const result = await AuthService.register(userData);

      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: result.message };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.message,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      return { success: false, message: error.message };
    }
  }, []);

  // Função de recuperação de senha com useCallback
  const resetPassword = useCallback(async (email) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const result = await AuthService.resetPassword(email);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return result;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      return { success: false, message: error.message };
    }
  }, []);

  // Função de logout com useCallback
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    }
  }, []);

  // Limpar erro com useCallback
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Atualizar dados do usuário com useCallback
  const updateUser = useCallback((userData) => {
    const updatedUser = AuthService.updateCurrentUser(userData);
    if (updatedUser) {
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: { user: updatedUser },
      });
    }
  }, []);

  // Verificar permissões com useCallback
  const hasPermission = useCallback(
    (permission) => {
      if (!state.user) return false;

      switch (permission) {
        case "admin":
          return AuthService.isAdmin();
        case "manager":
          return AuthService.isManager();
        case "driver":
          return AuthService.isDriver();
        default:
          return false;
      }
    },
    [state.user]
  );

  // Verificar se pode acessar veículo com useCallback
  const canAccessVehicle = useCallback((vehicleId) => {
    return AuthService.canAccessVehicle(vehicleId);
  }, []);

  // Verificar se pode fazer check-in com useCallback
  const canCheckIn = useCallback((vehicleId) => {
    return AuthService.canCheckIn(vehicleId);
  }, []);

  // Verificar se pode fazer check-out com useCallback
  const canCheckOut = useCallback((vehicleId) => {
    return AuthService.canCheckOut(vehicleId);
  }, []);

  const value = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Funções
    login,
    register,
    resetPassword,
    logout,
    updateUser,
    clearError,

    // Verificações
    hasPermission,
    canAccessVehicle,
    canCheckIn,
    canCheckOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook customizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export default AuthContext;
