import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaCar, FaUsers, FaTools, FaChartLine } from 'react-icons/fa';
import ApiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    inUseVehicles: 0,
    maintenanceVehicles: 0,
    totalUsers: 0,
    pendingRequests: 0
  });

  const { user } = useAuth();

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
        pendingRequests: dashboardData.chamados_pendentes || 0
      });

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      
      // Se a API não estiver disponível, mostrar dados vazios ou de exemplo
      setStats({
        totalVehicles: 0,
        availableVehicles: 0,
        inUseVehicles: 0,
        maintenanceVehicles: 0,
        totalUsers: 1, // Pelo menos o usuário logado
        pendingRequests: 0
      });
      
      setError('Não foi possível carregar os dados do dashboard. Conecte-se ao backend.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Carregando dados do dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Cabeçalho */}
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary-apm fw-bold">
            Dashboard
          </h2>
          <p className="text-muted">
            Bem-vindo, {user?.name || 'Usuário'}! Aqui está um resumo do sistema.
          </p>
        </Col>
      </Row>

      {/* Alerta de erro */}
      {error && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>⚠️ Aviso</Alert.Heading>
          {error}
        </Alert>
      )}

      {/* Cards de Estatísticas */}
      <Row className="g-4">
        {/* Total de Veículos */}
        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary text-white rounded-circle p-3 me-3">
                <FaCar size={24} />
              </div>
              <div>
                <h5 className="mb-0">{stats.totalVehicles}</h5>
                <small className="text-muted">Total de Veículos</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Veículos Disponíveis */}
        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success text-white rounded-circle p-3 me-3">
                <FaCar size={24} />
              </div>
              <div>
                <h5 className="mb-0">{stats.availableVehicles}</h5>
                <small className="text-muted">Disponíveis</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Veículos em Uso */}
        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-warning text-white rounded-circle p-3 me-3">
                <FaCar size={24} />
              </div>
              <div>
                <h5 className="mb-0">{stats.inUseVehicles}</h5>
                <small className="text-muted">Em Uso</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Veículos em Manutenção */}
        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-danger text-white rounded-circle p-3 me-3">
                <FaTools size={24} />
              </div>
              <div>
                <h5 className="mb-0">{stats.maintenanceVehicles}</h5>
                <small className="text-muted">Em Manutenção</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Segunda linha de estatísticas */}
      <Row className="g-4 mt-2">
        {/* Total de Usuários */}
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-info text-white rounded-circle p-3 me-3">
                <FaUsers size={24} />
              </div>
              <div>
                <h5 className="mb-0">{stats.totalUsers}</h5>
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
                <h5 className="mb-0">{stats.pendingRequests}</h5>
                <small className="text-muted">Chamados Pendentes</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Informações do Sistema */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="text-primary-apm">Status do Sistema</h5>
              <p className="text-muted mb-0">
                {error 
                  ? '🔴 Backend desconectado - Dados limitados disponíveis'
                  : '🟢 Sistema funcionando normalmente'
                }
              </p>
              <small className="text-muted">
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;