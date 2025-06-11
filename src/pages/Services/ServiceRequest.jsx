import React from "react";
import { Container, Card, Button, Alert } from "react-bootstrap";
import { FaTools, FaGasPump, FaWrench } from "react-icons/fa";
import BackButton from "../../components/common/BackButton";

function ServiceRequest() {
  return (
    <Container>
      <div className="mb-3">
        <BackButton />
      </div>
      
      <div className="text-center mb-4">
        <h2 className="text-primary-apm">
          <FaTools className="me-2" />
          Solicitação de Serviços
        </h2>
        <p className="text-muted">
          Solicite combustível ou manutenção para os veículos
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="shadow">
            <Card.Body className="p-4">
              <Alert variant="info" className="mb-4">
                <strong>Em desenvolvimento:</strong>
                <br />
                Esta página terá formulários para solicitação de combustível e
                manutenção.
              </Alert>

              <div className="row g-4">
                <div className="col-md-6">
                  <Card className="h-100 border-primary">
                    <Card.Body className="text-center">
                      <FaGasPump size={50} className="text-primary mb-3" />
                      <h5>Combustível</h5>
                      <p className="text-muted">Solicitar abastecimento</p>
                      <Button variant="primary" disabled>
                        Em breve
                      </Button>
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-md-6">
                  <Card className="h-100 border-warning">
                    <Card.Body className="text-center">
                      <FaWrench size={50} className="text-warning mb-3" />
                      <h5>Manutenção</h5>
                      <p className="text-muted">Solicitar reparo ou revisão</p>
                      <Button variant="warning" disabled>
                        Em breve
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default ServiceRequest;
