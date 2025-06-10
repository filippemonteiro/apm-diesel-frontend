import React from "react";
import { Container, Card, Button, Alert } from "react-bootstrap";
import { FaSignOutAlt, FaQrcode } from "react-icons/fa";

function CheckOut() {
  return (
    <Container>
      <div className="text-center mb-4">
        <h2 className="text-primary-apm">
          <FaSignOutAlt className="me-2" />
          Check-out de Veículo
        </h2>
        <p className="text-muted">Escaneie o QR Code para devolver o veículo</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card className="shadow">
            <Card.Body className="text-center p-5">
              <FaQrcode size={80} className="text-warning mb-4" />
              <h5 className="mb-3">Scanner QR Code</h5>
              <p className="text-muted mb-4">
                Esta funcionalidade será implementada no próximo passo com
                leitura de QR Code via câmera.
              </p>

              <Alert variant="info">
                <strong>Em desenvolvimento:</strong>
                <br />
                • Scanner de QR Code com câmera
                <br />
                • Validação de veículo em uso
                <br />
                • Formulário de check-out
                <br />• Atualização de status e quilometragem
              </Alert>

              <Button variant="warning" size="lg" disabled>
                <FaQrcode className="me-2" />
                Escanear QR Code
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default CheckOut;
