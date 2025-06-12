import React, { createContext, useContext, useReducer, useEffect } from "react";
import AuthService from "../services/auth";
import LocalStorageService from "../services/localStorage";
import { USER_ROLES } from "../utils/constants";

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Importante: inicia como true
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
  INIT_SUCCESS: "INIT_SUCCESS", // Nova action para inicialização
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

    case AUTH_ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
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
        // Inicializar dados padrão se necessário
        LocalStorageService.initializeDefaultData();

        // Verificar se existe usuário e token no localStorage
        const user = LocalStorageService.getCurrentUser();
        const token = LocalStorageService.getAuthToken();

        console.log('🔍 Verificando autenticação:', { user: !!user, token: !!token });

        if (user && token) {
          // Verificar se o token não expirou
          try {
            const tokenData = JSON.parse(atob(token));
            const isTokenValid = Date.now() < tokenData.exp;
            
            console.log('🔑 Token válido:', isTokenValid);

            if (isTokenValid) {
              // Token válido, usuário autenticado
              dispatch({
                type: AUTH_ACTIONS.INIT_SUCCESS,
                payload: { user },
              });
              console.log('✅ Usuário autenticado automaticamente:', user.name);
            } else {
              // Token expirado, limpar dados
              console.log('❌ Token expirado, fazendo logout');
              LocalStorageService.clearAuthData();
              dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
          } catch (tokenError) {
            // Token inválido, limpar dados
            console.log('❌ Token inválido:', tokenError);
            LocalStorageService.clearAuthData();
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          }
        } else {
          // Sem usuário ou token, não autenticado
          console.log('❌ Nenhum usuário ou token encontrado');
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: { error: error.message },
        });
      }
    };

    checkAuth();
  }, []); // Dependência vazia é correta aqui

  // Função de login
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const result = await AuthService.login(credentials);

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.user },
        });
        console.log('✅ Login realizado:', result.user.name);
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
  };

  // Função de registro
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const result = await AuthService.register(userData);

      if (result.success) {
        // Após registro bem-sucedido, redirecionar para login
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
  };

  // Função de recuperação de senha
  const resetPassword = async (email) => {
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
  };

  // Função de logout
  const logout = async () => {
    try {
      await AuthService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      console.log('✅ Logout realizado');
      return { success: true };
    } catch (error) {
      // Mesmo com erro, faz logout local
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      console.log('✅ Logout local realizado');
      return { success: true };
    }
  };

  // Atualizar dados do usuário
  const updateUser = (userData) => {
    const updatedUser = AuthService.updateCurrentUser(userData);
    if (updatedUser) {
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: { user: updatedUser },
      });
    }
  };

  // Limpar erro
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Verificar permissões
  const hasPermission = (permission) => {
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
  };

  // Verificar se pode acessar veículo
  const canAccessVehicle = (vehicleId) => {
    return AuthService.canAccessVehicle(vehicleId);
  };

  // Verificar se pode fazer check-in
  const canCheckIn = (vehicleId) => {
    return AuthService.canCheckIn(vehicleId);
  };

  // Verificar se pode fazer check-out
  const canCheckOut = (vehicleId) => {
    return AuthService.canCheckOut(vehicleId);
  };

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
