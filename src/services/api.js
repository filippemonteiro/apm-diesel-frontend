import axios from "axios";
import { toast } from "react-toastify";
import LocalStorageService from "./localStorage";
import { MESSAGES } from "../utils/constants";

// 🔥 CONFIGURAÇÃO DE PRODUÇÃO
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.controllcar.com.br/api",
  timeout: 15000, // Aumentado para 15s
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor de requisições - adiciona token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = LocalStorageService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `📡 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor de respostas - trata erros globalmente
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${
        response.status
      }`
    );
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    console.error(
      `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${
        status || "NETWORK_ERROR"
      }`
    );
    console.error("Detalhes:", message);

    // Trata erros de autenticação
    if (status === 401) {
      console.warn("🔑 401 Unauthorized - Sessão expirada");
      LocalStorageService.clearAuthData();
      toast.error("Sessão expirada. Faça login novamente.");

      // Só redireciona se não estiver já na página de login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Trata erros de servidor
    if (status >= 500) {
      toast.error("Erro no servidor. Tente novamente em alguns minutos.");
      return Promise.reject(error);
    }

    // Trata erros de rede
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Classe principal da API - APENAS PRODUÇÃO
class ApiService {
  // ===== AUTENTICAÇÃO =====
  async login(credentials) {
    try {
      console.log("🔐 Fazendo login:", credentials.email);

      const response = await api.post("/login", credentials);

      if (!response.data.token) {
        throw new Error("Token não retornado pelo servidor");
      }

      // Salvar token imediatamente
      LocalStorageService.setAuthToken(response.data.token);
      console.log("💾 Token salvo com sucesso");

      // Buscar dados do usuário
      try {
        const userResponse = await api.post("/me");
        LocalStorageService.setCurrentUser(userResponse.data);
        console.log("👤 Dados do usuário carregados:", userResponse.data.name);

        return {
          user: userResponse.data,
          token: response.data.token,
          message: response.data.message || "Login realizado com sucesso",
        };
      } catch (userError) {
        console.error("❌ Erro ao buscar dados do usuário:", userError);

        // Criar usuário básico a partir do email
        const basicUser = {
          email: credentials.email,
          name: credentials.email.split("@")[0],
          role: "4", // Motorista por padrão
        };
        LocalStorageService.setCurrentUser(basicUser);

        return {
          user: basicUser,
          token: response.data.token,
          message: "Login realizado com sucesso",
        };
      }
    } catch (error) {
      console.error("❌ Erro no login:", error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error("Email ou senha incorretos");
    }
  }

  async register(userData) {
    try {
      const response = await api.post("/cadastro", userData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        throw new Error(firstError);
      }
      throw new Error("Erro ao criar conta. Tente novamente.");
    }
  }

  async logout() {
    try {
      await api.post("/logout");
      console.log("✅ Logout realizado no backend");
    } catch (error) {
      console.warn("⚠️ Erro no logout do backend:", error.message);
    } finally {
      LocalStorageService.clearAuthData();
      console.log("🧹 Dados locais limpos");
    }

    return {
      message: "Logout realizado com sucesso",
    };
  }

  async resetPassword(email) {
    try {
      const response = await api.post("/reset-password", { email });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao enviar email de recuperação.");
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.post("/me");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao obter dados do usuário.");
    }
  }

  // ===== VEÍCULOS =====
  async getVehicles() {
    try {
      const response = await api.get("/veiculos");
      console.log("🚗 Veículos carregados:", response.data?.data?.length || 0);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar veículos:", error);
      throw new Error("Erro ao carregar lista de veículos.");
    }
  }

  async getVehicleById(id) {
    try {
      const response = await api.get(`/veiculos/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar veículo:", error);
      throw new Error("Veículo não encontrado.");
    }
  }

  async getVehicleByQrCode(qrCode) {
    try {
      const response = await api.get(`/carros/qr/${qrCode}`);
      return response.data;
    } catch (error) {
      console.error("❌ QR Code não encontrado:", qrCode);
      throw new Error("QR Code não encontrado.");
    }
  }

  async createVehicle(vehicleData) {
    try {
      const response = await api.post("/veiculos", vehicleData);
      console.log("✅ Veículo criado:", vehicleData.placa);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao criar veículo:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        throw new Error(firstError);
      }
      throw new Error("Erro ao cadastrar veículo.");
    }
  }

  async updateVehicle(id, vehicleData) {
    try {
      const response = await api.put(`/veiculos/${id}`, vehicleData);
      console.log("✅ Veículo atualizado:", id);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao atualizar veículo:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao atualizar veículo.");
    }
  }

  async deleteVehicle(id) {
    try {
      const response = await api.delete(`/veiculos/${id}`);
      console.log("✅ Veículo excluído:", id);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao excluir veículo:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao excluir veículo.");
    }
  }

  // ===== USUÁRIOS =====
  async getUsers() {
    try {
      const response = await api.get("/usuarios");
      console.log("👥 Usuários carregados:", response.data?.data?.length || 0);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar usuários:", error);
      throw new Error("Erro ao carregar lista de usuários.");
    }
  }

  async getUserById(id) {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar usuário:", error);
      throw new Error("Usuário não encontrado.");
    }
  }

  async createUser(userData) {
    try {
      const response = await api.post("/usuarios", userData);
      console.log("✅ Usuário criado:", userData.email);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        throw new Error(firstError);
      }
      throw new Error("Erro ao cadastrar usuário.");
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      console.log("✅ Usuário atualizado:", id);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        throw new Error(firstError);
      }
      throw new Error("Erro ao atualizar usuário.");
    }
  }

  async deleteUser(id) {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      console.log("✅ Usuário excluído:", id);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao excluir usuário:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao excluir usuário.");
    }
  }

  // ===== CHECK-IN/CHECK-OUT =====
  async checkInVehicle(data) {
    try {
      const response = await api.post("/checkin", data);
      console.log("✅ Check-in realizado:", data.qrCode);
      return response.data;
    } catch (error) {
      console.error("❌ Erro no check-in:", error);
      throw new Error("Erro ao realizar check-in.");
    }
  }

  async checkOutVehicle(data) {
    try {
      const response = await api.post("/checkout", data);
      console.log("✅ Check-out realizado:", data.qrCode);
      return response.data;
    } catch (error) {
      console.error("❌ Erro no check-out:", error);
      throw new Error("Erro ao realizar check-out.");
    }
  }

  // ===== DASHBOARD =====
  async getDashboardData() {
    try {
      const response = await api.get("/dashboard/totais");
      console.log("📊 Dashboard carregado");
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao carregar dashboard:", error);
      throw new Error("Erro ao carregar dados do dashboard.");
    }
  }

  // ===== SERVIÇOS =====
  async getServiceRequests() {
    try {
      const response = await api.get("/servicos");
      console.log("🔧 Serviços carregados");
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao carregar serviços:", error);
      throw new Error("Erro ao carregar solicitações de serviço.");
    }
  }

  async createServiceRequest(serviceData) {
    try {
      const response = await api.post("/servicos", serviceData);
      console.log("✅ Serviço solicitado:", serviceData.tipo);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao solicitar serviço:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao solicitar serviço.");
    }
  }

  async getServiceHistory(userId = null) {
    try {
      const url = userId ? `/servicos?motorista_id=${userId}` : "/servicos";
      const response = await api.get(url);
      console.log("📋 Histórico de serviços carregado");
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao carregar histórico:", error);
      throw new Error("Erro ao carregar histórico de serviços.");
    }
  }

  // ===== RELATÓRIOS =====
  async getReports() {
    try {
      const response = await api.get("/relatorios");
      console.log("📋 Relatórios carregados");
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao carregar relatórios:", error);
      throw new Error("Erro ao buscar relatórios.");
    }
  }

  // ===== OPÇÕES/CONFIGURAÇÕES =====
  async getVehicleOptions() {
    try {
      const response = await api.get("/veiculos/options");
      return response.data;
    } catch (error) {
      console.warn("⚠️ Endpoint de opções não disponível, usando padrões");
      // Retorna dados padrão para não quebrar o sistema
      return {
        marcas: ["Ford", "Mercedes-Benz", "Iveco", "Volkswagen", "Renault"],
        tipos: ["Van", "Caminhão", "Ônibus", "Carro", "Utilitário"],
        combustiveis: ["Gasolina", "Diesel", "Flex", "Elétrico"],
        status: ["Disponível", "Em uso", "Manutenção", "Indisponível"],
      };
    }
  }

  async getUserOptions() {
    try {
      const response = await api.get("/usuarios/options");
      return response.data;
    } catch (error) {
      console.warn("⚠️ Endpoint de opções não disponível, usando padrões");
      // Retorna dados padrão para não quebrar o sistema
      return {
        roles: [
          { value: "1", label: "Super Admin" },
          { value: "2", label: "Admin" },
          { value: "3", label: "Operador" },
          { value: "4", label: "Motorista" },
        ],
        status: [
          { value: "1", label: "Ativo" },
          { value: "0", label: "Inativo" },
        ],
      };
    }
  }

  // ===== UTILITÁRIOS =====

  // Testar conectividade
  async testConnection() {
    try {
      const response = await api.get("/health");
      return { connected: true, status: response.status };
    } catch (error) {
      // Fallback: tentar endpoint básico
      try {
        const response = await fetch(api.defaults.baseURL.replace("/api", ""));
        return {
          connected: response.ok,
          status: response.status,
          fallback: true,
        };
      } catch (fallbackError) {
        return { connected: false, error: error.message };
      }
    }
  }

  // Verificar se o token ainda é válido
  async validateToken() {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      console.warn("🔑 Token inválido ou expirado");
      return false;
    }
  }

  // Configurar URL da API dinamicamente
  setApiUrl(newUrl) {
    api.defaults.baseURL = newUrl;
    console.log(`🔧 URL da API alterada para: ${newUrl}`);
  }
}

// Exportar instância única do serviço
export default new ApiService();
