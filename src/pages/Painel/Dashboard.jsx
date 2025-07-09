import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  FaCar,
  FaUsers,
  FaTools,
  FaChartLine,
  FaCogs,
  FaQrcode,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    inUseVehicles: 0,
    maintenanceVehicles: 0,
    totalUsers: 0,
    pendingRequests: 0,
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Tentar carregar dados do backend
      const dashboardData = await ApiService.getDashboardData();

      setStats({
        totalVehicles: dashboardData.total_carros || 0,
        availableVehicles: dashboardData.carros_disponiveis || 0,
        inUseVehicles: dashboardData.carros_em_uso || 0,
        maintenanceVehicles: dashboardData.carros_manutencao || 0,
        totalUsers: dashboardData.total_usuarios || 0,
        pendingRequests: dashboardData.chamados_pendentes || 0,
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);

      // Se a API não estiver disponível, mostrar dados vazios ou de exemplo
      setStats({
        totalVehicles: 0,
        availableVehicles: 0,
        inUseVehicles: 0,
        maintenanceVehicles: 0,
        totalUsers: 1, // Pelo menos o usuário logado
        pendingRequests: 0,
      });

      setError(
        "Não foi possível carregar os dados do dashboard. Conecte-se ao backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // Verificar se é admin ou manager
  const isAdminOrManager = () => {
    return (
      user?.role === "admin" ||
      user?.role === "manager" ||
      user?.role === "1" ||
      user?.role === "2"
    );
  };

  // Função para navegação
  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Carregando dados do dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Cabeçalho Compacto */}
      <Row className="mb-3">
        <Col>
          <div className="text-center text-md-start">
            <h2 className="text-primary-apm fw-bold mb-1">Dashboard</h2>
            <p className="text-muted mb-0 small">
              Olá, {user?.name || "Usuário"}! Resumo do sistema:
            </p>
          </div>
        </Col>
      </Row>

      {/* Alerta de erro - Compacto */}
      {error && (
        <Alert variant="warning" className="mb-3 py-2">
          <div className="d-flex align-items-center">
            <div className="me-2">⚠️</div>
            <small>{error}</small>
          </div>
        </Alert>
      )}

      {/* Cards de Estatísticas - LAYOUT OTIMIZADO PARA MOBILE */}
      <Row className="g-3 mb-4">
        {/* Total e Disponíveis - Primeira linha mobile */}
        <Col xs={6} md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3 text-center">
              <div
                className="bg-primary text-white rounded-circle p-2 mb-2 mx-auto"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaCar size={16} />
              </div>
              <h4 className="mb-0 fw-bold" style={{ fontSize: "1.25rem" }}>
                {stats.totalVehicles}
              </h4>
              <small className="text-muted">Total Veículos</small>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3 text-center">
              <div
                className="bg-success text-white rounded-circle p-2 mb-2 mx-auto"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaCar size={16} />
              </div>
              <h4 className="mb-0 fw-bold" style={{ fontSize: "1.25rem" }}>
                {stats.availableVehicles}
              </h4>
              <small className="text-muted">Disponíveis</small>
            </Card.Body>
          </Card>
        </Col>

        {/* Em Uso e Manutenção - Segunda linha mobile */}
        <Col xs={6} md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3 text-center">
              <div
                className="bg-warning text-white rounded-circle p-2 mb-2 mx-auto"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaCar size={16} />
              </div>
              <h4 className="mb-0 fw-bold" style={{ fontSize: "1.25rem" }}>
                {stats.inUseVehicles}
              </h4>
              <small className="text-muted">Em Uso</small>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3 text-center">
              <div
                className="bg-danger text-white rounded-circle p-2 mb-2 mx-auto"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTools size={16} />
              </div>
              <h4 className="mb-0 fw-bold" style={{ fontSize: "1.25rem" }}>
                {stats.maintenanceVehicles}
              </h4>
              <small className="text-muted">Manutenção</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estatísticas Secundárias - Compactas */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3 d-flex align-items-center">
              <div
                className="bg-info text-white rounded-circle p-2 me-3"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaUsers size={16} />
              </div>
              <div>
                <h5 className="mb-0 fw-bold">{stats.totalUsers}</h5>
                <small className="text-muted">Usuários</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3 d-flex align-items-center">
              <div
                className="bg-secondary text-white rounded-circle p-2 me-3"
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaChartLine size={16} />
              </div>
              <div>
                <h5 className="mb-0 fw-bold">{stats.pendingRequests}</h5>
                <small className="text-muted">Chamados</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Seção Administrativa - APENAS FUNCIONALIDADES ÚNICAS */}
      {isAdminOrManager() && (
        <>
          <Row className="mb-3">
            <Col>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="text-primary-apm fw-bold mb-1">
                    <FaCogs className="me-2" />
                    Administração
                  </h5>
                  <p className="text-muted mb-0 small">
                    Funcionalidades exclusivas para gestores
                  </p>
                </div>
                <Badge bg="warning" className="d-none d-md-inline">
                  Admin
                </Badge>
              </div>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            {/* Gerenciar Veículos */}
            <Col xs={12} sm={6} lg={4}>
              <Card
                className="shadow-sm cursor-pointer h-100"
                onClick={() => handleNavigation("/vehicles")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Card.Body className="text-center p-4">
                  <div
                    className="bg-primary text-white rounded-circle p-3 mb-3 mx-auto"
                    style={{
                      width: "60px",
                      height: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaCar size={24} />
                  </div>
                  <Card.Title className="h6 mb-2">
                    Gerenciar Veículos
                  </Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    Adicione, remova e atualize os dados dos veículos.
                  </Card.Text>
                  <Badge bg="primary">Acessar</Badge>
                </Card.Body>
              </Card>
            </Col>

            {/* Gerenciar Usuários */}
            <Col xs={12} sm={6} lg={4}>
              <Card
                className="shadow-sm cursor-pointer h-100"
                onClick={() => handleNavigation("/users")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Card.Body className="text-center p-4">
                  <div
                    className="bg-info text-white rounded-circle p-3 mb-3 mx-auto"
                    style={{
                      width: "60px",
                      height: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaUsers size={24} />
                  </div>
                  <Card.Title className="h6 mb-2">
                    Gerenciar Usuários
                  </Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    Adicione, remova e edite os perfis de usuário.
                  </Card.Text>
                  <Badge bg="primary">Acessar</Badge>
                </Card.Body>
              </Card>
            </Col>

            {/* QR Codes - Mantido pois é específico para admin */}
            <Col xs={12} sm={6} lg={4}>
              <Card
                className="shadow-sm cursor-pointer h-100"
                onClick={() => handleNavigation("/qr-codes")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Card.Body className="text-center p-4">
                  <div
                    className="bg-dark text-white rounded-circle p-3 mb-3 mx-auto"
                    style={{
                      width: "60px",
                      height: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaQrcode size={24} />
                  </div>
                  <Card.Title className="h6 mb-2">QR Codes</Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    Códigos QR dos veículos
                  </Card.Text>
                  <Badge bg="dark">Acessar</Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Status do Sistema - Compacto */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-2 px-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-primary-apm fw-semibold">
                    Status do Sistema
                  </small>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                    {error ? "🔴 Limitado" : "🟢 Operacional"}
                  </div>
                </div>
                <div className="text-end d-none d-md-block">
                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {new Date().toLocaleString("pt-BR")}
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
