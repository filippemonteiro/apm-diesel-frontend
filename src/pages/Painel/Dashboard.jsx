import React from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaCar, 
  FaTools, 
  FaHistory, 
  FaQrcode,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import LocalStorageService from "../../services/localStorage";

function Painel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Buscar estatísticas
  const vehicles = LocalStorageService.getAllVehicles();
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const inUseVehicles = vehicles.filter(v => v.status === 'in_use').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-primary-apm mb-1">
                <FaTachometerAlt className="me-2" />
                Painel
              </h2>
              <p className="text-muted mb-0">
                Bem-vindo, {user?.name}! Gerencie sua frota aqui.
              </p>
            </div>
          </div>

          {/* Estatísticas */}
          <Row className="g-3 mb-4">
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <FaCheckCircle size={32} className="text-success" />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-0">Disponíveis</h6>
                    <h3 className="mb-0">{availableVehicles}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <FaCar size={32} className="text-warning" />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-0">Em Uso</h6>
                    <h3 className="mb-0">{inUseVehicles}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <FaExclamationTriangle size={32} className="text-danger" />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-0">Manutenção</h6>
                    <h3 className="mb-0">{maintenanceVehicles}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Menu de Ações */}
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <FaCar size={40} className="text-primary mb-3" />
                  <h5>Check-in</h5>
                  <p className="text-muted">Retirar veículo</p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/checkin')}
                  >
                    Acessar
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <FaCar size={40} className="text-warning mb-3" />
                  <h5>Check-out</h5>
                  <p className="text-muted">Devolver veículo</p>
                  <Button 
                    variant="warning" 
                    onClick={() => navigate('/checkout')}
                  >
                    Acessar
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <FaTools size={40} className="text-success mb-3" />
                  <h5>Serviços</h5>
                  <p className="text-muted">Solicitar manutenção</p>
                  <Button 
                    variant="success" 
                    onClick={() => navigate('/service-request')}
                  >
                    Acessar
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <FaHistory size={40} className="text-info mb-3" />
                  <h5>Histórico</h5>
                  <p className="text-muted">Ver atividades</p>
                  <Button 
                    variant="info" 
                    onClick={() => navigate('/service-history')}
                  >
                    Acessar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Link para QR Codes */}
          <Alert variant="light" className="mt-4 d-flex align-items-center justify-content-between">
            <div>
              <FaQrcode className="me-2" />
              <strong>Teste o Sistema:</strong> Para testar o check-in e check-out, você precisa dos QR Codes dos veículos.
            </div>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={() => navigate('/qr-codes')}
            >
              Ver QR Codes
            </Button>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}

export default Painel;
