import { STORAGE_KEYS, VEHICLE_STATUS, USER_ROLES } from '../utils/constants';

// Classe para gerenciar dados no localStorage
class LocalStorageService {
  
  // Métodos genéricos para localStorage
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return false;
    }
  }

  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      return false;
    }
  }

  // Inicializar dados padrão
  initializeDefaultData() {
    // Usuários padrão
    if (!this.getItem(STORAGE_KEYS.users)) {
      const defaultUsers = [
        {
          id: 1,
          email: 'admin@aupm.com',
          password: '123456',
          name: 'Administrador AuPM',
          role: USER_ROLES.ADMIN,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          email: 'motorista@aupm.com',
          password: '123456',
          name: 'João Silva',
          role: USER_ROLES.DRIVER,
          createdAt: new Date().toISOString()
        }
      ];
      this.setItem(STORAGE_KEYS.users, defaultUsers);
    }

    // Veículos padrão
    if (!this.getItem(STORAGE_KEYS.vehicles)) {
      const defaultVehicles = [
        {
          id: 1,
          plate: 'ABC-1234',
          model: 'Ford Transit',
          year: 2023,
          brand: 'Ford',
          qrCode: 'AUPM_VEHICLE_1',
          status: VEHICLE_STATUS.AVAILABLE,
          lastCheckIn: null,
          lastCheckOut: null,
          currentUserId: null,
          odometer: 45000,
          fuelLevel: 80
        },
        {
          id: 2,
          plate: 'DEF-5678',
          model: 'Sprinter',
          year: 2022,
          brand: 'Mercedes-Benz',
          qrCode: 'AUPM_VEHICLE_2',
          status: VEHICLE_STATUS.AVAILABLE,
          lastCheckIn: null,
          lastCheckOut: null,
          currentUserId: null,
          odometer: 32000,
          fuelLevel: 60
        },
        {
          id: 3,
          plate: 'GHI-9012',
          model: 'Daily',
          year: 2023,
          brand: 'Iveco',
          qrCode: 'AUPM_VEHICLE_3',
          status: VEHICLE_STATUS.MAINTENANCE,
          lastCheckIn: '2024-01-10T14:30:00.000Z',
          lastCheckOut: null,
          currentUserId: null,
          odometer: 28000,
          fuelLevel: 25
        }
      ];
      this.setItem(STORAGE_KEYS.vehicles, defaultVehicles);
    }

    // Histórico de veículos padrão
    if (!this.getItem(STORAGE_KEYS.vehicleHistory)) {
      const defaultHistory = [
        {
          id: 1,
          vehicleId: 1,
          userId: 2,
          userName: 'João Silva',
          vehiclePlate: 'ABC-1234',
          action: 'checkin',
          timestamp: '2024-01-15T08:30:00.000Z',
          location: 'Garagem Principal',
          odometer: 44950,
          fuelLevel: 85,
          notes: 'Veículo em perfeitas condições'
        },
        {
          id: 2,
          vehicleId: 1,
          userId: 2,
          userName: 'João Silva',
          vehiclePlate: 'ABC-1234',
          action: 'checkout',
          timestamp: '2024-01-15T17:45:00.000Z',
          location: 'Garagem Principal',
          odometer: 45000,
          fuelLevel: 80,
          notes: 'Entrega realizada com sucesso'
        }
      ];
      this.setItem(STORAGE_KEYS.vehicleHistory, defaultHistory);
    }

    // Solicitações de serviço padrão
    if (!this.getItem(STORAGE_KEYS.serviceRequests)) {
      const defaultRequests = [
        {
          id: 1,
          vehicleId: 3,
          userId: 2,
          userName: 'João Silva',
          vehiclePlate: 'GHI-9012',
          type: 'maintenance',
          title: 'Revisão Programada',
          description: 'Revisão dos 30.000 km - trocar óleo, filtros e verificar freios',
          priority: 'medium',
          status: 'pending',
          createdAt: '2024-01-16T09:00:00.000Z',
          updatedAt: '2024-01-16T09:00:00.000Z'
        },
        {
          id: 2,
          vehicleId: 2,
          userId: 2,
          userName: 'João Silva',
          vehiclePlate: 'DEF-5678',
          type: 'fuel',
          title: 'Abastecimento',
          description: 'Solicito abastecimento completo do veículo',
          priority: 'high',
          status: 'approved',
          createdAt: '2024-01-16T14:30:00.000Z',
          updatedAt: '2024-01-16T15:00:00.000Z'
        }
      ];
      this.setItem(STORAGE_KEYS.serviceRequests, defaultRequests);
    }
  }

  // Métodos específicos para usuários
  getAllUsers() {
    return this.getItem(STORAGE_KEYS.users) || [];
  }

  getUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email === email);
  }

  createUser(userData) {
    const users = this.getAllUsers();
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.setItem(STORAGE_KEYS.users, users);
    return newUser;
  }

  // Métodos específicos para veículos
  getAllVehicles() {
    return this.getItem(STORAGE_KEYS.vehicles) || [];
  }

  getVehicleById(id) {
    const vehicles = this.getAllVehicles();
    return vehicles.find(vehicle => vehicle.id === parseInt(id));
  }

  getVehicleByQrCode(qrCode) {
    const vehicles = this.getAllVehicles();
    return vehicles.find(vehicle => vehicle.qrCode === qrCode);
  }

  updateVehicle(vehicleId, updates) {
    const vehicles = this.getAllVehicles();
    const index = vehicles.findIndex(v => v.id === parseInt(vehicleId));
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updates };
      this.setItem(STORAGE_KEYS.vehicles, vehicles);
      return vehicles[index];
    }
    return null;
  }

  // Métodos específicos para histórico
  getAllHistory() {
    return this.getItem(STORAGE_KEYS.vehicleHistory) || [];
  }

  addHistoryEntry(historyData) {
    const history = this.getAllHistory();
    const newEntry = {
      ...historyData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    history.unshift(newEntry); // Adiciona no início para ordem cronológica
    this.setItem(STORAGE_KEYS.vehicleHistory, history);
    return newEntry;
  }

  getHistoryByUserId(userId) {
    const history = this.getAllHistory();
    return history.filter(entry => entry.userId === parseInt(userId));
  }

  getHistoryByVehicleId(vehicleId) {
    const history = this.getAllHistory();
    return history.filter(entry => entry.vehicleId === parseInt(vehicleId));
  }

  // Métodos específicos para solicitações de serviço
  getAllServiceRequests() {
    return this.getItem(STORAGE_KEYS.serviceRequests) || [];
  }

  addServiceRequest(requestData) {
    const requests = this.getAllServiceRequests();
    const newRequest = {
      ...requestData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    requests.unshift(newRequest);
    this.setItem(STORAGE_KEYS.serviceRequests, requests);
    return newRequest;
  }

  updateServiceRequest(requestId, updates) {
    const requests = this.getAllServiceRequests();
    const index = requests.findIndex(r => r.id === parseInt(requestId));
    if (index !== -1) {
      requests[index] = { 
        ...requests[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.setItem(STORAGE_KEYS.serviceRequests, requests);
      return requests[index];
    }
    return null;
  }

  getServiceRequestsByUserId(userId) {
    const requests = this.getAllServiceRequests();
    return requests.filter(request => request.userId === parseInt(userId));
  }

  // Métodos de autenticação
  setCurrentUser(user) {
    this.setItem(STORAGE_KEYS.user, user);
  }

  getCurrentUser() {
    return this.getItem(STORAGE_KEYS.user);
  }

  setAuthToken(token) {
    this.setItem(STORAGE_KEYS.token, token);
  }

  getAuthToken() {
    return this.getItem(STORAGE_KEYS.token);
  }

  clearAuthData() {
    this.removeItem(STORAGE_KEYS.user);
    this.removeItem(STORAGE_KEYS.token);
  }

  // Método para limpar todos os dados (reset da aplicação)
  clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }
}

// Exportar instância única do serviço
export default new LocalStorageService();