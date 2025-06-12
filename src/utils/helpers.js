// Funções auxiliares para o sistema APM Diesel

// Formatar data e hora
export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Formatar apenas data
export const formatDate = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

// Formatar número com separador de milhares
export const formatNumber = (number) => {
  if (!number && number !== 0) return "";
  return number.toLocaleString("pt-BR");
};

// Formatar quilometragem
export const formatKilometers = (km) => {
  if (!km && km !== 0) return "0 km";
  return `${formatNumber(km)} km`;
};

// Formatar porcentagem
export const formatPercentage = (value) => {
  if (!value && value !== 0) return "0%";
  return `${value}%`;
};

// Validar QR Code
export const isValidQRCode = (qrCode) => {
  if (!qrCode) return false;
  // Verifica se começa com APM_VEHICLE_
  return qrCode.startsWith("APM_VEHICLE_");
};

// Obter cor do status
export const getStatusColor = (status) => {
  const colors = {
    available: "success",
    in_use: "warning",
    maintenance: "danger",
  };
  return colors[status] || "secondary";
};

// Obter texto do status
export const getStatusText = (status) => {
  const texts = {
    available: "Disponível",
    in_use: "Em Uso",
    maintenance: "Manutenção",
  };
  return texts[status] || "Desconhecido";
};

// Calcular diferença de quilometragem
export const calculateKmDifference = (kmInicial, kmFinal) => {
  if (!kmInicial || !kmFinal) return 0;
  return kmFinal - kmInicial;
};

// Validar se a quilometragem é válida
export const isValidOdometer = (currentKm, previousKm) => {
  if (!currentKm || currentKm < 0) return false;
  if (previousKm && currentKm < previousKm) return false;
  return true;
};

// Gerar código único
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Verificar se é dispositivo móvel
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Obter saudação baseada no horário
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Truncar texto
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
