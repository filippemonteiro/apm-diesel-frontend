import { STORAGE_KEYS } from "../utils/constants";

// Classe para gerenciar dados no localStorage
class LocalStorageService {
  // Métodos genéricos para localStorage
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
      return false;
    }
  }

  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Erro ao ler do localStorage:", error);
      return null;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Erro ao remover do localStorage:", error);
      return false;
    }
  }

  // Métodos de autenticação
  setCurrentUser(user) {
    console.log("💾 LocalStorage.setCurrentUser:", user.name || user.email);
    this.setItem(STORAGE_KEYS.user, user);
  }

  getCurrentUser() {
    const user = this.getItem(STORAGE_KEYS.user);
    console.log("📦 LocalStorage.getCurrentUser:", user?.name || user?.email || "null");
    return user;
  }

  setAuthToken(token) {
    console.log("💾 LocalStorage.setAuthToken:", !!token);
    this.setItem(STORAGE_KEYS.token, token);
  }

  getAuthToken() {
    const token = this.getItem(STORAGE_KEYS.token);
    console.log("🔑 LocalStorage.getAuthToken:", !!token);
    return token;
  }

  clearAuthData() {
    console.log("🧹 LocalStorage.clearAuthData");
    this.removeItem(STORAGE_KEYS.user);
    this.removeItem(STORAGE_KEYS.token);
  }

  // Método para limpar todos os dados (reset da aplicação)
  clearAllData() {
    console.log("🧹 LocalStorage.clearAllData");
    Object.values(STORAGE_KEYS).forEach((key) => {
      this.removeItem(key);
    });
  }

  // Métodos de utilidade para verificação de dados
  isAuthenticated() {
    const user = this.getCurrentUser();
    const token = this.getAuthToken();
    return !!(user && token);
  }

  getUserRole() {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  getUserId() {
    const user = this.getCurrentUser();
    return user?.id || null;
  }

  getUserName() {
    const user = this.getCurrentUser();
    return user?.name || user?.email || "Usuário";
  }
}

// Exportar instância única do serviço
export default new LocalStorageService();