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
    // Se não há backend, simula respostas
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      console.log("🔄 Backend não disponível - usando dados simulados");
      return Promise.resolve({
        data: {
          message: "Simulação ativa - dados do localStorage",
          simulated: true,
        },
      });
    }

    // Trata erros de autenticação
    if (error.response?.status === 401) {
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

// Classe principal da API com métodos simulados
class ApiService {
  // Simular delay de rede
  async simulateDelay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // AUTENTICAÇÃO
  async login(credentials) {
    await this.simulateDelay();

    try {
      // Tentar requisição real
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      // Fallback para simulação
      const user = LocalStorageService.getUserByEmail(credentials.email);

      if (!user || user.password !== credentials.password) {
        throw new Error(MESSAGES.error.invalidCredentials);
      }

      const token = btoa(
        JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 })
      );
      const userData = { ...user };
      delete userData.password;

      LocalStorageService.setCurrentUser(userData);
      LocalStorageService.setAuthToken(token);

      return {
        user: userData,
        token,
        message: MESSAGES.success.login,
      };
    }
  }

  async register(userData) {
    await this.simulateDelay();

    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      // Fallback para simulação
      const existingUser = LocalStorageService.getUserByEmail(userData.email);

      if (existingUser) {
        throw new Error(MESSAGES.error.userExists);
      }

      const newUser = LocalStorageService.createUser({
        ...userData,
        role: userData.role || "driver",
      });

      const userResponse = { ...newUser };
      delete userResponse.password;

      return {
        user: userResponse,
        message: MESSAGES.success.register,
      };
    }
  }

  async resetPassword(email) {
    await this.simulateDelay();

    try {
      const response = await api.post("/auth/reset-password", { email });
      return response.data;
    } catch (error) {
      // Fallback para simulação
      const user = LocalStorageService.getUserByEmail(email);

      if (!user) {
        throw new Error("Email não encontrado");
      }

      return {
        message: MESSAGES.success.passwordReset,
      };
    }
  }

  async logout() {
    await this.simulateDelay(200);

    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Continua mesmo se der erro na API
    } finally {
      LocalStorageService.clearAuthData();
      return {
        message: MESSAGES.success.logout,
      };
    }
  }

  // VEÍCULOS
  async getVehicles() {
    await this.simulateDelay();

    try {
      const response = await api.get("/vehicles");
      return response.data;
    } catch (error) {
      return {
        vehicles: LocalStorageService.getAllVehicles(),
        simulated: true,
      };
    }
  }

  async getVehicleById(id) {
    await this.simulateDelay();

    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      const vehicle = LocalStorageService.getVehicleById(id);
      if (!vehicle) {
        throw new Error(MESSAGES.error.vehicleNotFound);
      }
      return { vehicle, simulated: true };
    }
  }

  async getVehicleByQrCode(qrCode) {
    await this.simulateDelay();

    try {
      const response = await api.get(`/vehicles/qr/${qrCode}`);
      return response.data;
    } catch (error) {
      const vehicle = LocalStorageService.getVehicleByQrCode(qrCode);
      if (!vehicle) {
        throw new Error(MESSAGES.error.vehicleNotFound);
      }
      return { vehicle, simulated: true };
    }
  }

  // CHECK-IN/CHECK-OUT
  async checkInVehicle(data) {
    await this.simulateDelay();

    try {
      const response = await api.post("/vehicles/checkin", data);
      return response.data;
    } catch (error) {
      // Fallback para simulação
      const vehicle = LocalStorageService.getVehicleByQrCode(data.qrCode);

      if (!vehicle) {
        throw new Error(MESSAGES.error.vehicleNotFound);
      }

      if (vehicle.status === "in_use") {
        throw new Error(MESSAGES.error.vehicleInUse);
      }

      const currentUser = LocalStorageService.getCurrentUser();

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

      return {
        vehicle: updatedVehicle,
        history: historyEntry,
        message: MESSAGES.success.checkIn,
        simulated: true,
      };
    }
  }

  async checkOutVehicle(data) {
    await this.simulateDelay();

    try {
      const response = await api.post("/vehicles/checkout", data);
      return response.data;
    } catch (error) {
      // Fallback para simulação
      const vehicle = LocalStorageService.getVehicleByQrCode(data.qrCode);

      if (!vehicle) {
        throw new Error(MESSAGES.error.vehicleNotFound);
      }

      const currentUser = LocalStorageService.getCurrentUser();

      if (
        vehicle.status !== "in_use" ||
        vehicle.currentUserId !== currentUser.id
      ) {
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
    await this.simulateDelay();

    try {
      const response = await api.get(
        `/history${userId ? `?userId=${userId}` : ""}`
      );
      return response.data;
    } catch (error) {
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
    await this.simulateDelay();

    try {
      const response = await api.get(
        `/service-requests${userId ? `?userId=${userId}` : ""}`
      );
      return response.data;
    } catch (error) {
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
    await this.simulateDelay();

    try {
      const response = await api.post("/service-requests", requestData);
      return response.data;
    } catch (error) {
      const currentUser = LocalStorageService.getCurrentUser();
      const vehicle = LocalStorageService.getVehicleById(requestData.vehicleId);

      const newRequest = LocalStorageService.addServiceRequest({
        ...requestData,
        userId: currentUser.id,
        userName: currentUser.name,
        vehiclePlate: vehicle?.plate || "N/A",
        status: "pending",
      });

      return {
        request: newRequest,
        message: MESSAGES.success.serviceRequest,
        simulated: true,
      };
    }
  }

  async updateServiceRequest(requestId, updates) {
    await this.simulateDelay();

    try {
      const response = await api.put(`/service-requests/${requestId}`, updates);
      return response.data;
    } catch (error) {
      const updatedRequest = LocalStorageService.updateServiceRequest(
        requestId,
        updates
      );

      if (!updatedRequest) {
        throw new Error("Solicitação não encontrada");
      }

      return {
        request: updatedRequest,
        simulated: true,
      };
    }
  }
}

// Exportar instância única do serviço
export default new ApiService();
