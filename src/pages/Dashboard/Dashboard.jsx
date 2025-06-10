import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaTachometerAlt, FaCar, FaTools, FaHistory } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-primary-apm mb-1">
                <FaTachometerAlt className="me-2" />
                Dashboard
              </h2>
              <p className="text-muted mb-0">
                Bem-vindo, {user?.name}! Gerencie sua frota aqui.
              </p>
            </div>
          </div>

          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <FaCar size={40} className="text-primary mb-3" />
                  <h5>Check-in</h5>
                  <p className="text-muted">Retirar veículo</p>
                  <Button variant="primary" href="/checkin">
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
                  <Button variant="warning" href="/checkout">
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
                  <Button variant="success" href="/service-request">
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
                  <Button variant="info" href="/service-history">
                    Acessar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
