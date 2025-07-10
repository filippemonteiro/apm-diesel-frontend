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
  FaWifi,
  FaSync,
} from "react-icons/fa";
import ApiService from "../../services/api";
import { toast } from "react-toastify";

function QRCodeGenerator() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async (showRetryMessage = false) => {
    setLoading(true);
    setError(null);

    if (showRetryMessage) {
      setIsRetrying(true);
      toast.info("Carregando veículos...");
    }

    try {
      console.log("🔍 Carregando veículos do backend...");
      const response = await ApiService.getVehicles();
      console.log("📋 Resposta completa da API:", response);

      // Verificar estrutura da resposta - CORRIGIDO
      let vehicleList = [];

      if (response && response.data && Array.isArray(response.data)) {
        vehicleList = response.data;
        console.log("✅ Usando response.data (array)");
      } else if (response && Array.isArray(response)) {
        vehicleList = response;
        console.log("✅ Usando response direto (array)");
      } else if (
        response &&
        response.vehicles &&
        Array.isArray(response.vehicles)
      ) {
        vehicleList = response.vehicles;
        console.log("✅ Usando response.vehicles (array)");
      } else {
        console.warn("⚠️ Estrutura de resposta não reconhecida:", response);
        throw new Error("Formato de resposta inesperado do servidor");
      }

      setVehicles(vehicleList);
      console.log(`✅ ${vehicleList.length} veículos carregados com sucesso`);

      if (showRetryMessage && vehicleList.length > 0) {
        toast.success(`${vehicleList.length} veículos carregados!`);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar veículos:", error);
      setError(error.message || "Erro ao conectar com o servidor");

      if (showRetryMessage) {
        toast.error("Falha ao carregar veículos: " + error.message);
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  const handleRetry = () => {
    loadVehicles(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      disponivel: { variant: "success", text: "Disponível" },
      em_uso: { variant: "warning", text: "Em Uso" },
      manutencao: { variant: "danger", text: "Manutenção" },
      indisponivel: { variant: "secondary", text: "Indisponível" },
      available: { variant: "success", text: "Disponível" },
      in_use: { variant: "warning", text: "Em Uso" },
      maintenance: { variant: "danger", text: "Manutenção" },
      unavailable: { variant: "secondary", text: "Indisponível" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      text: status,
    };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const handlePrint = () => {
    window.print();
  };

  const generateQRCode = (vehicle) => {
    // Gerar QR Code baseado nos dados do veículo
    const qrData =
      vehicle.qrCode || vehicle.qr_code || `APM_VEHICLE_${vehicle.id}`;
    return qrData;
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" size="lg" />
          <h4 className="mt-3 text-primary">
            {isRetrying ? "Reconectando..." : "Carregando QR Codes..."}
          </h4>
          <p className="text-muted">
            {isRetrying
              ? "Tentando reestabelecer conexão com o servidor"
              : "Obtendo dados dos veículos do servidor"}
          </p>
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
        <p className="text-muted">
          Códigos QR para identificação e controle da frota
        </p>

        <div className="d-flex justify-content-center gap-2 mb-3">
          <Button
            variant="primary"
            onClick={handlePrint}
            className="d-print-none"
            disabled={vehicles.length === 0}
          >
            <FaPrint className="me-2" />
            Imprimir QR Codes
          </Button>

          <Button
            variant="outline-secondary"
            onClick={handleRetry}
            className="d-print-none"
            disabled={loading}
          >
            <FaSync className={`me-2 ${loading ? "fa-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Indicador de Status */}
      {!error && vehicles.length > 0 && (
        <Alert variant="success" className="mb-4 d-print-none">
          <FaWifi className="me-2" />
          <strong>Sistema Online:</strong> {vehicles.length} veículos carregados
          da base de dados
        </Alert>
      )}

      {/* Alerta de erro */}
      {error && (
        <Alert variant="danger" className="mb-4 d-print-none">
          <FaExclamationTriangle className="me-2" />
          <strong>Erro:</strong> {error}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={handleRetry}>
              <FaSync className="me-1" />
              Tentar Novamente
            </Button>
          </div>
        </Alert>
      )}

      {/* Lista de Veículos */}
      <div className="print-area">
        {vehicles.length === 0 && !loading && !error && (
          <div className="text-center py-5">
            <FaCar size={64} className="text-muted mb-3" />
            <h4 className="text-muted">Nenhum veículo cadastrado</h4>
            <p className="text-muted">
              Cadastre veículos no sistema para gerar os QR Codes
            </p>
          </div>
        )}

        {vehicles.length === 0 && !loading && error && (
          <div className="text-center py-5">
            <FaExclamationTriangle size={64} className="text-danger mb-3" />
            <h4 className="text-danger">Falha ao Carregar Dados</h4>
            <p className="text-muted">Erro: {error}</p>
            <Button variant="primary" onClick={handleRetry}>
              <FaSync className="me-2" />
              Tentar Reconectar
            </Button>
          </div>
        )}

        <Row className="g-4">
          {vehicles.map((vehicle) => (
            <Col key={vehicle.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary-apm text-white">
                  <h6 className="mb-0">
                    <FaCar className="me-2" />
                    {vehicle.modelo || vehicle.model}
                  </h6>
                </Card.Header>
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <QRCode
                      value={generateQRCode(vehicle)}
                      size={180}
                      level="H"
                      includeMargin={true}
                      style={{
                        border: "2px solid #f8f9fa",
                        borderRadius: "8px",
                        padding: "8px",
                        background: "white",
                      }}
                    />
                  </div>

                  <h5 className="mb-2 fw-bold text-primary">
                    {vehicle.placa || vehicle.plate}
                  </h5>

                  <p className="text-muted mb-2">
                    <strong>{vehicle.marca || vehicle.brand}</strong>
                    {vehicle.ano && ` - ${vehicle.ano}`}
                  </p>

                  {vehicle.cor && (
                    <p className="text-muted small mb-2">Cor: {vehicle.cor}</p>
                  )}

                  <div className="mb-3">{getStatusBadge(vehicle.status)}</div>

                  <div className="border-top pt-2">
                    <small className="text-muted d-block">
                      <strong>Código:</strong> {generateQRCode(vehicle)}
                    </small>
                    <small className="text-muted d-block">
                      <strong>ID:</strong> {vehicle.id}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Instruções de Uso */}
      {vehicles.length > 0 && (
        <Card className="mt-4 d-print-none">
          <Card.Header>
            <h5 className="mb-0">📖 Instruções de Uso</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6>🖨️ Para Imprimir:</h6>
                <ol className="small">
                  <li>Clique em "Imprimir QR Codes"</li>
                  <li>Configure a impressora para papel A4</li>
                  <li>Recomenda-se imprimir em etiquetas adesivas</li>
                  <li>Cole no para-brisa ou painel do veículo</li>
                </ol>
              </Col>
              <Col md={6}>
                <h6>📱 Para Usar no Sistema:</h6>
                <ol className="small">
                  <li>Acesse "Check-in" ou "Check-out" no menu</li>
                  <li>Clique em "Escanear QR Code"</li>
                  <li>Aponte a câmera para o código</li>
                  <li>Complete as informações solicitadas</li>
                </ol>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default QRCodeGenerator;
