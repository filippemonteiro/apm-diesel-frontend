import axios from "axios";
import { toast } from "react-toastify";
import LocalStorageService from "./localStorage";
import { MESSAGES } from "../utils/constants";

// Configuração base do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisições - adiciona token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = LocalStorageService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respostas - trata erros globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "🚨 Interceptor pegou erro:",
      error.response?.status,
      error.response?.data
    );

    // Trata erros de autenticação
    if (error.response?.status === 401) {
      console.warn("🔑 401 Unauthorized - limpando dados e redirecionando");
      LocalStorageService.clearAuthData();
      toast.error("Sessão expirada. Faça login novamente.");
      window.location.href = "/login";
    }

    // Trata outros erros HTTP
    if (error.response?.status >= 500) {
      toast.error(MESSAGES.error.networkError);
    }

    return Promise.reject(error);
  }
);

// Classe principal da API
class ApiService {
  // AUTENTICAÇÃO
  async login(credentials) {
    try {
      console.log(
        "📡 ApiService.login - enviando para:",
        api.defaults.baseURL + "/login"
      );
      console.log("📡 ApiService.login - dados:", { email: credentials.email });

      const response = await api.post("/login", credentials);

      console.log("✅ ApiService.login - resposta completa:", response);
      console.log("✅ ApiService.login - response.data:", response.data);

      // Backend retorna só token, precisamos buscar dados do usuário
      if (response.data.token) {
        console.log("💾 Salvando token:", !!response.data.token);
        LocalStorageService.setAuthToken(response.data.token);

        // Buscar dados do usuário com o token
        try {
          console.log("👤 Buscando dados do usuário...");
          const userResponse = await api.post("/me");
          console.log("👤 Dados do usuário:", userResponse.data);

          LocalStorageService.setCurrentUser(userResponse.data);

          return {
            user: userResponse.data,
            token: response.data.token,
            message: response.data.message,
          };
        } catch (userError) {
          console.error("❌ Erro ao buscar usuário:", userError);
          // Se falhar ao buscar usuário, criar um usuário básico
          const basicUser = {
            email: credentials.email,
            name: credentials.email.split("@")[0],
            role: "driver",
          };
          LocalStorageService.setCurrentUser(basicUser);

          return {
            user: basicUser,
            token: response.data.token,
            message: response.data.message,
          };
        }
      } else {
        console.warn("⚠️ Resposta sem token:", response.data);
        throw new Error("Token não recebido do servidor");
      }
    } catch (error) {
      console.error("❌ ApiService.login - erro:", error);
      console.error("❌ Error response:", error.response?.data);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(MESSAGES.error.invalidCredentials);
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
      throw new Error("Erro ao criar conta. Tente novamente.");
    }
  }

  async logout() {
    try {
      await api.post("/logout");
    } catch (error) {
      // Continua mesmo se der erro na API
      console.warn("Erro no logout do backend:", error);
    } finally {
      // Sempre limpa os dados locais
      LocalStorageService.clearAuthData();
    }

    return {
      message: MESSAGES.success.logout,
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

  // USUÁRIO ATUAL
  async getCurrentUser() {
    try {
      const response = await api.post("/me");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao obter dados do usuário.");
    }
  }

  // VEÍCULOS (endpoints futuros)
  async getVehicles() {
    try {
      const response = await api.get("/carros");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar veículos.");
    }
  }

  async getVehicleById(id) {
    try {
      const response = await api.get(`/carros/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Veículo não encontrado.");
    }
  }

  async getVehicleByQrCode(qrCode) {
    try {
      const response = await api.get(`/carros/qr/${qrCode}`);
      return response.data;
    } catch (error) {
      throw new Error("QR Code não encontrado.");
    }
  }

  // CHECK-IN/CHECK-OUT
  async checkInVehicle(data) {
    try {
      const response = await api.post("/checkin", data);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao realizar check-in.");
    }
  }

  async checkOutVehicle(data) {
    try {
      const response = await api.post("/checkout", data);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao realizar check-out.");
    }
  }

  // ROTAS (endpoints futuros)
  async getRoutes() {
    try {
      const response = await api.get("/rotas");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar rotas.");
    }
  }

  // RELATÓRIOS
  async getReports() {
    try {
      const response = await api.get("/relatorios");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar relatórios.");
    }
  }

  // DASHBOARD
  async getDashboardData() {
    try {
      const response = await api.get("/dashboard/totais");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao carregar dados do dashboard.");
    }
  }
}

// Exportar instância única do serviço
export default new ApiService();
