import axios from "axios";
import { toast } from "react-toastify";
import LocalStorageService from "./localStorage";
import { MESSAGES } from "../utils/constants";

// Configuração base do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
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
    // Trata erros de autenticação
    if (error.response?.status === 401) {
      LocalStorageService.clearAuthData();
      toast.error("Sessão expirada. Faça login novamente.");
      window.location.href = "/login";
    }

    // Trata outros erros HTTP
    if (error.response?.status >= 500) {
      toast.error("Erro de conexão. Tente novamente.");
    }

    return Promise.reject(error);
  }
);

// Classe principal da API com métodos simulados
class ApiService {
  // Simular delay de rede
  async simulateDelay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // AUTENTICAÇÃO
  async login(credentials) {
    console.log("🔐 ApiService.login iniciado:", credentials.email);
    await this.simulateDelay();

    try {
      // Tentar requisição real
      console.log("📡 Tentando requisição real...");
      const response = await api.post("/auth/login", credentials);
      console.log("✅ Resposta do backend:", response.data);
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - usando simulação local");

      // Fallback para simulação
      const user = LocalStorageService.getUserByEmail(credentials.email);

      if (!user) {
        console.log("❌ Usuário não encontrado:", credentials.email);
        throw new Error(MESSAGES.error.invalidCredentials);
      }

      if (user.password !== credentials.password) {
        console.log("❌ Senha incorreta para:", credentials.email);
        throw new Error(MESSAGES.error.invalidCredentials);
      }

      // Criar token simulado
      const token = btoa(
        JSON.stringify({
          userId: user.id,
          exp: Date.now() + 86400000, // 24 horas
        })
      );

      // Preparar dados do usuário (sem senha)
      const userData = { ...user };
      delete userData.password;

      // Salvar no localStorage
      LocalStorageService.setCurrentUser(userData);
      LocalStorageService.setAuthToken(token);

      console.log("✅ Login simulado realizado:", userData.name);

      return {
        user: userData,
        token,
        message: MESSAGES.success.login,
      };
    }
  }

  async register(userData) {
    console.log("📝 ApiService.register iniciado");
    await this.simulateDelay();

    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - usando simulação para registro");

      // Fallback para simulação
      const existingUser = LocalStorageService.getUserByEmail(userData.email);

      if (existingUser) {
        console.log("❌ Email já existe:", userData.email);
        throw new Error(MESSAGES.error.userExists);
      }

      const newUser = LocalStorageService.createUser({
        ...userData,
        role: userData.role || "driver",
      });

      const userResponse = { ...newUser };
      delete userResponse.password;

      console.log("✅ Usuário criado:", userResponse.name);

      return {
        user: userResponse,
        message: MESSAGES.success.register,
      };
    }
  }

  async resetPassword(email) {
    console.log("🔑 ApiService.resetPassword iniciado:", email);
    await this.simulateDelay();

    try {
      const response = await api.post("/auth/reset-password", { email });
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - usando simulação para reset");

      // Fallback para simulação
      const user = LocalStorageService.getUserByEmail(email);

      if (!user) {
        console.log("❌ Email não encontrado para reset:", email);
        throw new Error("Email não encontrado");
      }

      console.log("✅ Reset simulado enviado para:", email);

      return {
        message: MESSAGES.success.passwordReset,
      };
    }
  }

  async logout() {
    console.log("🚪 ApiService.logout iniciado");
    await this.simulateDelay(200);

    try {
      await api.post("/auth/logout");
      console.log("✅ Logout no backend realizado");
    } catch (error) {
      console.log("⚠️ Erro no logout do backend, continuando...");
      // Continua mesmo se der erro na API
    }

    // Sempre limpa os dados locais (movido para fora do finally)
    LocalStorageService.clearAuthData();
    console.log("✅ Dados locais limpos");

    return {
      message: "Logout realizado com sucesso!",
    };
  }

  // VEÍCULOS
  async getVehicles() {
    console.log("🚗 ApiService.getVehicles iniciado");
    await this.simulateDelay();

    try {
      const response = await api.get("/vehicles");
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - retornando veículos locais");
      return {
        vehicles: LocalStorageService.getAllVehicles(),
        simulated: true,
      };
    }
  }

  async getVehicleById(id) {
    console.log("🚗 ApiService.getVehicleById iniciado:", id);
    await this.simulateDelay();

    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - buscando veículo local");
      const vehicle = LocalStorageService.getVehicleById(id);
      if (!vehicle) {
        console.log("❌ Veículo não encontrado:", id);
        throw new Error(MESSAGES.error.vehicleNotFound);
      }
      return { vehicle, simulated: true };
    }
  }

  async getVehicleByQrCode(qrCode) {
    console.log("📱 ApiService.getVehicleByQrCode iniciado:", qrCode);
    await this.simulateDelay();

    try {
      const response = await api.get(`/vehicles/qr/${qrCode}`);
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - buscando por QR local");
      const vehicle = LocalStorageService.getVehicleByQrCode(qrCode);
      if (!vehicle) {
        console.log("❌ QR Code não encontrado:", qrCode);
        throw new Error(MESSAGES.error.vehicleNotFound);
      }
      return { vehicle, simulated: true };
    }
  }

  // CHECK-IN/CHECK-OUT
  async checkInVehicle(data) {
    console.log("📥 ApiService.checkInVehicle iniciado:", data.qrCode);
    await this.simulateDelay();

    try {
      const response = await api.post("/vehicles/checkin", data);
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - fazendo check-in local");

      // Fallback para simulação
      const vehicle = LocalStorageService.getVehicleByQrCode(data.qrCode);

      if (!vehicle) {
        console.log("❌ Veículo não encontrado para check-in:", data.qrCode);
        throw new Error(MESSAGES.error.vehicleNotFound);
      }

      if (vehicle.status === "in_use") {
        console.log("❌ Veículo já em uso:", vehicle.plate);
        throw new Error(MESSAGES.error.vehicleInUse);
      }

      const currentUser = LocalStorageService.getCurrentUser();
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Atualizar veículo
      const updatedVehicle = LocalStorageService.updateVehicle(vehicle.id, {
        status: "in_use",
        currentUserId: currentUser.id,
        lastCheckIn: new Date().toISOString(),
      });

      // Adicionar ao histórico
      const historyEntry = LocalStorageService.addHistoryEntry({
        vehicleId: vehicle.id,
        userId: currentUser.id,
        userName: currentUser.name,
        vehiclePlate: vehicle.plate,
        action: "checkin",
        location: data.location || "Não informado",
        odometer: data.odometer || vehicle.odometer,
        fuelLevel: data.fuelLevel || vehicle.fuelLevel,
        notes: data.notes || "",
      });

      console.log("✅ Check-in local realizado:", vehicle.plate);

      return {
        vehicle: updatedVehicle,
        history: historyEntry,
        message: MESSAGES.success.checkIn,
        simulated: true,
      };
    }
  }

  async checkOutVehicle(data) {
    console.log("📤 ApiService.checkOutVehicle iniciado:", data.qrCode);
    await this.simulateDelay();

    try {
      const response = await api.post("/vehicles/checkout", data);
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - fazendo check-out local");

      // Fallback para simulação
      const vehicle = LocalStorageService.getVehicleByQrCode(data.qrCode);

      if (!vehicle) {
        console.log("❌ Veículo não encontrado para check-out:", data.qrCode);
        throw new Error(MESSAGES.error.vehicleNotFound);
      }

      const currentUser = LocalStorageService.getCurrentUser();
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      if (
        vehicle.status !== "in_use" ||
        vehicle.currentUserId !== currentUser.id
      ) {
        console.log("❌ Veículo não está em uso pelo usuário:", vehicle.plate);
        throw new Error(MESSAGES.error.vehicleNotInUse);
      }

      // Atualizar veículo
      const updatedVehicle = LocalStorageService.updateVehicle(vehicle.id, {
        status: "available",
        currentUserId: null,
        lastCheckOut: new Date().toISOString(),
        odometer: data.odometer || vehicle.odometer,
        fuelLevel: data.fuelLevel || vehicle.fuelLevel,
      });

      // Adicionar ao histórico
      const historyEntry = LocalStorageService.addHistoryEntry({
        vehicleId: vehicle.id,
        userId: currentUser.id,
        userName: currentUser.name,
        vehiclePlate: vehicle.plate,
        action: "checkout",
        location: data.location || "Não informado",
        odometer: data.odometer || vehicle.odometer,
        fuelLevel: data.fuelLevel || vehicle.fuelLevel,
        notes: data.notes || "",
      });

      console.log("✅ Check-out local realizado:", vehicle.plate);

      return {
        vehicle: updatedVehicle,
        history: historyEntry,
        message: MESSAGES.success.checkOut,
        simulated: true,
      };
    }
  }

  // HISTÓRICO
  async getVehicleHistory(userId = null) {
    console.log("📋 ApiService.getVehicleHistory iniciado:", userId);
    await this.simulateDelay();

    try {
      const response = await api.get(
        `/history${userId ? `?userId=${userId}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - retornando histórico local");
      const history = userId
        ? LocalStorageService.getHistoryByUserId(userId)
        : LocalStorageService.getAllHistory();

      return {
        history,
        simulated: true,
      };
    }
  }

  // SOLICITAÇÕES DE SERVIÇO
  async getServiceRequests(userId = null) {
    console.log("🔧 ApiService.getServiceRequests iniciado:", userId);
    await this.simulateDelay();

    try {
      const response = await api.get(
        `/service-requests${userId ? `?userId=${userId}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - retornando solicitações locais");
      const requests = userId
        ? LocalStorageService.getServiceRequestsByUserId(userId)
        : LocalStorageService.getAllServiceRequests();

      return {
        requests,
        simulated: true,
      };
    }
  }

  async createServiceRequest(requestData) {
    console.log("🔧 ApiService.createServiceRequest iniciado");
    await this.simulateDelay();

    try {
      const response = await api.post("/service-requests", requestData);
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - criando solicitação local");

      const currentUser = LocalStorageService.getCurrentUser();
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      const vehicle = LocalStorageService.getVehicleById(requestData.vehicleId);

      const newRequest = LocalStorageService.addServiceRequest({
        ...requestData,
        userId: currentUser.id,
        userName: currentUser.name,
        vehiclePlate: vehicle?.plate || "N/A",
        status: "pending",
      });

      console.log("✅ Solicitação local criada:", newRequest.id);

      return {
        request: newRequest,
        message: MESSAGES.success.serviceRequest,
        simulated: true,
      };
    }
  }

  async updateServiceRequest(requestId, updates) {
    console.log("🔧 ApiService.updateServiceRequest iniciado:", requestId);
    await this.simulateDelay();

    try {
      const response = await api.put(`/service-requests/${requestId}`, updates);
      return response.data;
    } catch (error) {
      console.log("🔄 Backend não disponível - atualizando solicitação local");

      const updatedRequest = LocalStorageService.updateServiceRequest(
        requestId,
        updates
      );

      if (!updatedRequest) {
        console.log("❌ Solicitação não encontrada:", requestId);
        throw new Error("Solicitação não encontrada");
      }

      console.log("✅ Solicitação local atualizada:", requestId);

      return {
        request: updatedRequest,
        simulated: true,
      };
    }
  }
}

// Exportar instância única do serviço
export default new ApiService();
