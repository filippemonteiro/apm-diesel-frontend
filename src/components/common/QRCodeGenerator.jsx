import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import QRCode from "react-qr-code";
import {
  FaQrcode,
  FaPrint,
  FaCar,
  FaExclamationTriangle,
} from "react-icons/fa";
import ApiService from "../../services/api";
import { toast } from "react-toastify";

function QRCodeGenerator() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.getVehicles();

      if (response.vehicles) {
        setVehicles(response.vehicles);
      } else {
        // Se não há dados do backend, criar QR codes de exemplo para demonstração
        const exampleVehicles = [
          {
            id: 1,
            model: "Ford Transit",
            plate: "ABC-1234",
            brand: "Ford",
            year: 2023,
            qrCode: "APM_VEHICLE_1",
            status: "available",
          },
          {
            id: 2,
            model: "Sprinter",
            plate: "DEF-5678",
            brand: "Mercedes-Benz",
            year: 2022,
            qrCode: "APM_VEHICLE_2",
            status: "available",
          },
          {
            id: 3,
            model: "Daily",
            plate: "GHI-9012",
            brand: "Iveco",
            year: 2023,
            qrCode: "APM_VEHICLE_3",
            status: "maintenance",
          },
        ];
        setVehicles(exampleVehicles);
        setError("Backend desconectado - Usando QR codes de demonstração");
      }
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);

      // Fallback: QR codes de exemplo para demonstração
      const exampleVehicles = [
        {
          id: 1,
          model: "Ford Transit",
          plate: "ABC-1234",
          brand: "Ford",
          year: 2023,
          qrCode: "APM_VEHICLE_1",
          status: "available",
        },
        {
          id: 2,
          model: "Sprinter",
          plate: "DEF-5678",
          brand: "Mercedes-Benz",
          year: 2022,
          qrCode: "APM_VEHICLE_2",
          status: "available",
        },
        {
          id: 3,
          model: "Daily",
          plate: "GHI-9012",
          brand: "Iveco",
          year: 2023,
          qrCode: "APM_VEHICLE_3",
          status: "maintenance",
        },
      ];
      setVehicles(exampleVehicles);
      setError(
        "Não foi possível carregar veículos do backend. Usando dados de demonstração."
      );
      toast.warning("Usando QR codes de demonstração");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <Container>
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Carregando QR codes...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="text-center mb-4">
        <h2 className="text-primary-apm">
          <FaQrcode className="me-2" />
          QR Codes dos Veículos
        </h2>
        <p className="text-muted">Para testar o sistema, use estes QR Codes</p>
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

      {/* Alerta de erro/aviso */}
      {error && (
        <Alert variant="warning" className="mb-4 d-print-none">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

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
