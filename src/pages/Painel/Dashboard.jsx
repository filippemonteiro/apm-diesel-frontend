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
  FaGasPump,
  FaWrench,
  FaClipboardList,
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

  // Função para navegação com animação
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
      {/* Cabeçalho */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary-apm fw-bold mb-1">Dashboard</h2>
              <p className="text-muted mb-0">
                Bem-vindo, {user?.name || "Usuário"}! Aqui está um resumo do
                sistema.
              </p>
            </div>
            <div className="text-end d-none d-md-block">
              <small className="text-muted">
                Última atualização: {new Date().toLocaleString("pt-BR")}
              </small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Alerta de erro */}
      {error && (
        <Alert variant="warning" className="mb-4">
          <div className="d-flex align-items-center">
            <div className="me-3">⚠️</div>
            <div>
              <Alert.Heading className="h6 mb-1">
                Sistema com limitações
              </Alert.Heading>
              <p className="mb-0">{error}</p>
            </div>
          </div>
        </Alert>
      )}

      {/* Cards de Estatísticas */}
      <Row className="g-4 mb-4">
        {/* Total de Veículos */}
        <Col xl={3} lg={6} md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary text-white rounded-circle p-3 me-3">
                <FaCar size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{stats.totalVehicles}</h4>
                <small className="text-muted">Total de Veículos</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Veículos Disponíveis */}
        <Col xl={3} lg={6} md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success text-white rounded-circle p-3 me-3">
                <FaCar size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{stats.availableVehicles}</h4>
                <small className="text-muted">Disponíveis</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Veículos em Uso */}
        <Col xl={3} lg={6} md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-warning text-white rounded-circle p-3 me-3">
                <FaCar size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{stats.inUseVehicles}</h4>
                <small className="text-muted">Em Uso</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Veículos em Manutenção */}
        <Col xl={3} lg={6} md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-danger text-white rounded-circle p-3 me-3">
                <FaTools size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{stats.maintenanceVehicles}</h4>
                <small className="text-muted">Em Manutenção</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Segunda linha de estatísticas */}
      <Row className="g-4 mb-5">
        {/* Total de Usuários */}
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-info text-white rounded-circle p-3 me-3">
                <FaUsers size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{stats.totalUsers}</h4>
                <small className="text-muted">Usuários Cadastrados</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Chamados Pendentes */}
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-secondary text-white rounded-circle p-3 me-3">
                <FaChartLine size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{stats.pendingRequests}</h4>
                <small className="text-muted">Chamados Pendentes</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ações Principais - Para todos os usuários */}
      <Row className="mb-4">
        <Col>
          <h5 className="text-primary-apm fw-bold mb-3">
            <FaTools className="me-2" />
            Ações Principais
          </h5>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        {/* Check-in */}
        <Col lg={3} md={6}>
          <Card
            className="h-100 shadow-sm cursor-pointer border-success"
            onClick={() => handleNavigation("/checkin")}
            style={{
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <Card.Body className="text-center">
              <div
                className="bg-success text-white rounded-circle p-3 mb-3 mx-auto"
                style={{ width: "fit-content" }}
              >
                <FaCar size={24} />
              </div>
              <Card.Title className="h6">Check-in</Card.Title>
              <Card.Text className="text-muted small">
                Iniciar uso de veículo
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Check-out */}
        <Col lg={3} md={6}>
          <Card
            className="h-100 shadow-sm cursor-pointer border-warning"
            onClick={() => handleNavigation("/checkout")}
            style={{
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <Card.Body className="text-center">
              <div
                className="bg-warning text-white rounded-circle p-3 mb-3 mx-auto"
                style={{ width: "fit-content" }}
              >
                <FaCar size={24} />
              </div>
              <Card.Title className="h6">Check-out</Card.Title>
              <Card.Text className="text-muted small">
                Finalizar uso de veículo
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Solicitação de Serviços */}
        <Col lg={3} md={6}>
          <Card
            className="h-100 shadow-sm cursor-pointer border-primary"
            onClick={() => handleNavigation("/service-request")}
            style={{
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <Card.Body className="text-center">
              <div
                className="bg-primary text-white rounded-circle p-3 mb-3 mx-auto"
                style={{ width: "fit-content" }}
              >
                <FaGasPump size={24} />
              </div>
              <Card.Title className="h6">Solicitar Serviços</Card.Title>
              <Card.Text className="text-muted small">
                Combustível e manutenção
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Histórico */}
        <Col lg={3} md={6}>
          <Card
            className="h-100 shadow-sm cursor-pointer border-info"
            onClick={() => handleNavigation("/service-history")}
            style={{
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <Card.Body className="text-center">
              <div
                className="bg-info text-white rounded-circle p-3 mb-3 mx-auto"
                style={{ width: "fit-content" }}
              >
                <FaClipboardList size={24} />
              </div>
              <Card.Title className="h6">Histórico</Card.Title>
              <Card.Text className="text-muted small">
                Ver relatórios e histórico
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Seção Administrativa - Apenas para Admin/Manager */}
      {isAdminOrManager() && (
        <>
          <Row className="mb-4">
            <Col>
              <h5 className="text-primary-apm fw-bold mb-3">
                <FaCogs className="me-2" />
                Administração
                <Badge bg="warning" className="ms-2">
                  Admin
                </Badge>
              </h5>
              <p className="text-muted mb-0">
                Ferramentas de gestão disponíveis apenas para administradores
              </p>
            </Col>
          </Row>

          <Row className="g-4 mb-5">
            {/* Gerenciar Veículos */}
            <Col lg={4} md={6}>
              <Card
                className="h-100 shadow-sm cursor-pointer"
                onClick={() => handleNavigation("/vehicles")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Card.Body className="text-center">
                  <div
                    className="bg-primary text-white rounded-circle p-3 mb-3 mx-auto"
                    style={{ width: "fit-content" }}
                  >
                    <FaCar size={28} />
                  </div>
                  <Card.Title className="h5">Gerenciar Veículos</Card.Title>
                  <Card.Text className="text-muted">
                    Cadastrar, editar e gerenciar toda a frota de veículos da
                    empresa
                  </Card.Text>
                  <div className="mt-auto">
                    <Badge bg="primary">Disponível</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Gerenciar Usuários */}
            <Col lg={4} md={6}>
              <Card
                className="h-100 shadow-sm cursor-pointer"
                onClick={() => handleNavigation("/users")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Card.Body className="text-center">
                  <div
                    className="bg-info text-white rounded-circle p-3 mb-3 mx-auto"
                    style={{ width: "fit-content" }}
                  >
                    <FaUsers size={28} />
                  </div>
                  <Card.Title className="h5">Gerenciar Usuários</Card.Title>
                  <Card.Text className="text-muted">
                    Cadastrar e gerenciar usuários e permissões do sistema
                  </Card.Text>
                  <div className="mt-auto">
                    <Badge bg="primary">Disponível</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* QR Codes */}
            <Col lg={4} md={6}>
              <Card
                className="h-100 shadow-sm cursor-pointer"
                onClick={() => handleNavigation("/qr-codes")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Card.Body className="text-center">
                  <div
                    className="bg-dark text-white rounded-circle p-3 mb-3 mx-auto"
                    style={{ width: "fit-content" }}
                  >
                    <FaQrcode size={28} />
                  </div>
                  <Card.Title className="h5">QR Codes</Card.Title>
                  <Card.Text className="text-muted">
                    Visualizar e gerenciar códigos QR dos veículos
                  </Card.Text>
                  <div className="mt-auto">
                    <Badge bg="dark">Disponível</Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Status do Sistema */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-primary-apm mb-1">Status do Sistema</h6>
                  <p className="text-muted mb-0">
                    {error
                      ? "🔴 Backend desconectado - Funcionalidades limitadas"
                      : "🟢 Sistema operacional - Todos os serviços funcionando"}
                  </p>
                </div>
                <div className="text-end d-none d-md-block">
                  <small className="text-muted">
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
