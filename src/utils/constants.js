// Constantes da aplicação APM Diesel
export const APP_CONFIG = {
  name: "APM Diesel",
  version: "1.0.0",
  description: "Sistema de Controle de Frota",
};

// Chaves do localStorage
export const STORAGE_KEYS = {
  user: "apm_user",
  token: "apm_token",
  vehicles: "apm_vehicles",
  vehicleHistory: "apm_vehicle_history",
  serviceRequests: "apm_service_requests",
  users: "apm_users",
};

// Status dos veículos
export const VEHICLE_STATUS = {
  AVAILABLE: "available",
  IN_USE: "in_use",
  MAINTENANCE: "maintenance",
};

// Tipos de ação no histórico
export const ACTION_TYPES = {
  CHECK_IN: "checkin",
  CHECK_OUT: "checkout",
};

// Tipos de solicitação de serviço
export const SERVICE_TYPES = {
  FUEL: "fuel",
  MAINTENANCE: "maintenance",
};

// Status das solicitações
export const REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  COMPLETED: "completed",
  REJECTED: "rejected",
};

// Roles de usuário
export const USER_ROLES = {
  ADMIN: "admin",
  DRIVER: "driver",
  MANAGER: "manager",
};

// Mensagens do sistema
export const MESSAGES = {
  success: {
    login: "Login realizado com sucesso!",
    logout: "Logout realizado com sucesso!",
    register: "Usuário cadastrado com sucesso!",
    checkIn: "Check-in realizado com sucesso!",
    checkOut: "Check-out realizado com sucesso!",
    serviceRequest: "Solicitação enviada com sucesso!",
    passwordReset: "Email de recuperação enviado!",
  },
  error: {
    invalidCredentials: "Email ou senha incorretos",
    userExists: "Usuário já cadastrado com este email",
    vehicleNotFound: "Veículo não encontrado",
    vehicleInUse: "Veículo já está em uso",
    vehicleNotInUse: "Veículo não está em uso",
    qrCodeInvalid: "QR Code inválido",
    networkError: "Erro de conexão. Tente novamente.",
    fillRequired: "Preencha todos os campos obrigatórios",
    emailInvalid: "Email inválido",
    passwordWeak: "Senha deve ter pelo menos 6 caracteres",
  },
  warning: {
    confirmAction: "Tem certeza que deseja realizar esta ação?",
    unsavedChanges: "Existem alterações não salvas",
  },
};

// Configurações de validação
export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Email deve ter um formato válido",
  },
  password: {
    minLength: 6,
    message: "Senha deve ter pelo menos 6 caracteres",
  },
  required: {
    message: "Este campo é obrigatório",
  },
};

// Configurações da câmera para QR Code
export const QR_CONFIG = {
  width: 300,
  height: 300,
  facingMode: "environment", // câmera traseira
  formats: ["QR_CODE"],
};

// Breakpoints responsivos (Bootstrap)
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};
