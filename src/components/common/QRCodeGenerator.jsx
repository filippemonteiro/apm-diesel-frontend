import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Badge, Button } from "react-bootstrap";
import QRCode from "react-qr-code";
import { FaQrcode, FaPrint, FaCar } from "react-icons/fa";
import LocalStorageService from "../../services/localStorage";

function QRCodeGenerator() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Carregar veículos do localStorage
    const allVehicles = LocalStorageService.getAllVehicles();
    setVehicles(allVehicles);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { variant: "success", text: "Disponível" },
      in_use: { variant: "warning", text: "Em Uso" },
      maintenance: { variant: "danger", text: "Manutenção" },
    };

    const config = statusConfig[status] || statusConfig.available;
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container>
      <div className="text-center mb-4">
        <h2 className="text-primary-apm">
          <FaQrcode className="me-2" />
          QR Codes dos Veículos
        </h2>
        <p className="text-muted">
          Para testar o sistema, use estes QR Codes
        </p>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handlePrint}
          className="d-print-none"
        >
          <FaPrint className="me-2" />
          Imprimir QR Codes
        </Button>
      </div>

      <Row className="g-4">
        {vehicles.map((vehicle) => (
          <Col key={vehicle.id} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-primary-apm text-white">
                <h6 className="mb-0">
                  <FaCar className="me-2" />
                  {vehicle.model}
                </h6>
              </Card.Header>
              <Card.Body className="text-center">
                <div className="mb-3">
                  <QRCode
                    value={vehicle.qrCode}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <h5 className="mb-2">{vehicle.plate}</h5>
                <p className="text-muted mb-2">
                  {vehicle.brand} - {vehicle.year}
                </p>
                <div className="mb-2">{getStatusBadge(vehicle.status)}</div>
                <small className="text-muted d-block">
                  Código: {vehicle.qrCode}
                </small>
                {vehicle.currentUserId && (
                  <small className="text-warning d-block mt-1">
                    Em uso por: Usuário #{vehicle.currentUserId}
                  </small>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Instruções */}
      <Card className="mt-4 d-print-none">
        <Card.Body>
          <h5>Como usar:</h5>
          <ol>
            <li>Imprima ou abra esta página em outro dispositivo</li>
            <li>Acesse a página de Check-in ou Check-out</li>
            <li>Clique em "Escanear QR Code"</li>
            <li>Aponte a câmera para um dos QR Codes acima</li>
            <li>Complete o formulário e confirme a ação</li>
          </ol>
          <hr />
          <p className="mb-0">
            <strong>Dica:</strong> Você pode testar escaneando a tela do
            computador com seu celular ou usar dois dispositivos.
          </p>
        </Card.Body>
      </Card>

      {/* Estilos para impressão */}
      <style jsx>{`
        @media print {
          .card {
            page-break-inside: avoid;
            border: 1px solid #000 !important;
          }
          .card-header {
            background-color: #f8f9fa !important;
            color: #000 !important;
            border-bottom: 1px solid #000 !important;
          }
          .badge {
            border: 1px solid #000 !important;
            color: #000 !important;
          }
        }
      `}</style>
    </Container>
  );
}

export default QRCodeGenerator;
