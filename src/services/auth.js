import ApiService from "./api";
import LocalStorageService from "./localStorage";
import { VALIDATION } from "../utils/constants";

class AuthService {
  // Validar email
  validateEmail(email) {
    if (!email) {
      return { isValid: false, message: "Email é obrigatório" };
    }

    if (!VALIDATION.email.pattern.test(email)) {
      return { isValid: false, message: VALIDATION.email.message };
    }

    return { isValid: true };
  }

  // Validar senha
  validatePassword(password) {
    if (!password) {
      return { isValid: false, message: "Senha é obrigatória" };
    }

    if (password.length < VALIDATION.password.minLength) {
      return { isValid: false, message: VALIDATION.password.message };
    }

    return { isValid: true };
  }

  // Validar campos obrigatórios
  validateRequired(value, fieldName) {
    if (!value || value.trim() === "") {
      return { isValid: false, message: `${fieldName} é obrigatório` };
    }
    return { isValid: true };
  }

  // Validar dados de login
  validateLoginData(credentials) {
    const errors = {};

    const emailValidation = this.validateEmail(credentials.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }

    const passwordValidation = this.validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Validar dados de registro
  validateRegisterData(userData) {
    const errors = {};

    // Validar nome
    const nameValidation = this.validateRequired(userData.name, "Nome");
    if (!nameValidation.isValid) {
      errors.name = nameValidation.message;
    }

    // Validar email
    const emailValidation = this.validateEmail(userData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
    }

    // Validar senha
    const passwordValidation = this.validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    // Validar confirmação de senha
    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = "Senhas não coincidem";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Realizar login
  async login(credentials) {
    try {
      console.log("🔐 AuthService.login iniciado com:", {
        email: credentials.email,
      });

      // Validar dados
      const validation = this.validateLoginData(credentials);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors)[0];
        console.log("❌ Validação falhou:", errorMessage);
        throw new Error(errorMessage);
      }

      // Fazer login via API
      console.log("📡 Chamando ApiService.login...");
      const response = await ApiService.login(credentials);
      console.log("✅ ApiService.login resposta:", response);

      return {
        success: true,
        user: response.user,
        token: response.token,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ AuthService.login erro:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Realizar registro
  async register(userData) {
    try {
      console.log("📝 AuthService.register iniciado");

      // Validar dados
      const validation = this.validateRegisterData(userData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      // Registrar via API
      const response = await ApiService.register(userData);

      return {
        success: true,
        user: response.user,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ AuthService.register erro:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Recuperar senha
  async resetPassword(email) {
    try {
      // Validar email
      const emailValidation = this.validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.message);
      }

      // Enviar solicitação via API
      const response = await ApiService.resetPassword(email);

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Realizar logout
  async logout() {
    try {
      console.log("🚪 AuthService.logout iniciado");
      const response = await ApiService.logout();
      console.log("✅ Logout realizado");

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      // Mesmo com erro, limpa dados locais
      console.log("⚠️ Erro no logout, limpando dados locais");
      LocalStorageService.clearAuthData();
      return {
        success: true,
        message: "Logout realizado",
      };
    }
  }

  // Verificar se usuário está autenticado (CORRIGIDO PARA SANCTUM)
  isAuthenticated() {
    const user = LocalStorageService.getCurrentUser();
    const token = LocalStorageService.getAuthToken();

    // Para tokens do Laravel Sanctum, apenas verificamos se existem user e token
    // A API do backend já controla a validade do token automaticamente
    return !!(user && token);
  }

  // Obter usuário atual
  getCurrentUser() {
    return LocalStorageService.getCurrentUser();
  }

  // Verificar se usuário tem determinada role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  // Verificar se é admin
  isAdmin() {
    return this.hasRole("admin");
  }

  // Verificar se é motorista
  isDriver() {
    return this.hasRole("driver");
  }

  // Verificar se é gerente
  isManager() {
    return this.hasRole("manager");
  }

  // Atualizar dados do usuário
  updateCurrentUser(userData) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      LocalStorageService.setCurrentUser(updatedUser);
      return updatedUser;
    }
    return null;
  }

  // Verificar permissões
  canAccessVehicle(vehicleId) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin pode acessar qualquer veículo
    if (this.isAdmin()) return true;

    // Motorista só pode acessar veículos que está usando
    const vehicle = LocalStorageService.getVehicleById(vehicleId);
    return vehicle && vehicle.currentUserId === user.id;
  }

  // Verificar se pode fazer check-in
  canCheckIn(vehicleId) {
    if (!this.isAuthenticated()) return false;

    const vehicle = LocalStorageService.getVehicleById(vehicleId);
    return vehicle && vehicle.status === "available";
  }

  // Verificar se pode fazer check-out
  canCheckOut(vehicleId) {
    if (!this.isAuthenticated()) return false;

    const user = this.getCurrentUser();
    const vehicle = LocalStorageService.getVehicleById(vehicleId);
    const currentUserId = vehicle?.currentUserId || vehicle?.current_user_id;

    return (
      vehicle &&
      (vehicle.status === "in_use" || vehicle.status === "em_uso") &&
      currentUserId === user.id
    );
  }
}

// Exportar instância única do serviço
export default new AuthService();
