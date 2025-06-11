import React, { useState } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import {
  FaSignInAlt,
  FaQrcode,
  FaCar,
  FaGasPump,
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaStickyNote,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import BackButton from "../../components/common/BackButton";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/api";
import QRCodeScanner from "../../components/common/QRCodeScanner";

function CheckIn() {
  const { user: _user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    odometer: "",
    fuelLevel: "",
    location: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  // Sucesso no scan
  const onScanSuccess = async (decodedText) => {
    setShowScanner(false);

    try {
      // Buscar dados do veículo
      const response = await ApiService.getVehicleByQrCode(decodedText);

      if (response.vehicle) {
        // Verificar se o veículo está disponível
        if (response.vehicle.status === "in_use") {
          toast.error("Este veículo já está em uso!");
          return;
        }

        if (response.vehicle.status === "maintenance") {
          toast.error("Este veículo está em manutenção!");
          return;
        }

        setVehicleData(response.vehicle);
        setShowCheckInForm(true);

        // Pré-preencher dados atuais
        setFormData((prev) => ({
          ...prev,
          odometer: response.vehicle.odometer || "",
          fuelLevel: response.vehicle.fuelLevel || "",
        }));

        toast.success("Veículo identificado! Complete o check-in.");
      }
    } catch (error) {
      toast.error(error.message || "Erro ao buscar dados do veículo");
    }
  };

  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};

    // Validar quilometragem
    if (!formData.odometer) {
      newErrors.odometer = "Quilometragem é obrigatória";
    } else if (parseInt(formData.odometer) < 0) {
      newErrors.odometer = "Quilometragem inválida";
    }

    // Validar nível de combustível
    if (!formData.fuelLevel) {
      newErrors.fuelLevel = "Nível de combustível é obrigatório";
    } else if (formData.fuelLevel < 0 || formData.fuelLevel > 100) {
      newErrors.fuelLevel = "Nível deve estar entre 0 e 100%";
    }

    // Validar localização
    if (!formData.location.trim()) {
      newErrors.location = "Localização é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter check-in
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const checkInData = {
        qrCode: vehicleData.qrCode,
        odometer: parseInt(formData.odometer),
        fuelLevel: parseInt(formData.fuelLevel),
        location: formData.location.trim(),
        notes: formData.notes.trim(),
        timestamp: new Date().toISOString(),
      };

      const response = await ApiService.checkInVehicle(checkInData);

      if (response) {
        toast.success(response.message || "Check-in realizado com sucesso!");

        // Resetar formulário
        setVehicleData(null);
        setShowCheckInForm(false);
        setFormData({
          odometer: "",
          fuelLevel: "",
          location: "",
          notes: "",
        });
      }
    } catch (error) {
      toast.error(error.message || "Erro ao realizar check-in");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancelar check-in
  const cancelCheckIn = () => {
    setShowCheckInForm(false);
    setVehicleData(null);
    setFormData({
      odometer: "",
      fuelLevel: "",
      location: "",
      notes: "",
    });
    setErrors({});
  };

  return (
    <Container>
      <div className="mb-3">
        <BackButton />
      </div>
      
      <div className="text-center mb-4">
        <h2 className="text-primary-apm">
          <FaSignInAlt className="me-2" />
          Check-in de Veículo
        </h2>
        <p className="text-muted">Escaneie o QR Code para retirar o veículo</p>
      </div>

      {/* Card principal quando não está scaneando */}
      {!showScanner && !showCheckInForm && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Card className="shadow">
              <Card.Body className="text-center p-5">
                <FaQrcode size={80} className="text-primary-apm mb-4" />
                <h5 className="mb-3">Scanner QR Code</h5>
                <p className="text-muted mb-4">
                  Aponte a câmera para o QR Code do veículo que deseja retirar
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowScanner(true)}
                  className="px-5"
                >
                  <FaQrcode className="me-2" />
                  Escanear QR Code
                </Button>

                <Alert variant="light" className="mt-4">
                  <small className="text-muted">
                    <strong>Dica:</strong> O QR Code geralmente está localizado
                    no para-brisa ou painel do veículo.
                  </small>
                </Alert>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      {/* Scanner de QR Code */}
      <QRCodeScanner
        show={showScanner}
        onHide={() => setShowScanner(false)}
        onScanSuccess={onScanSuccess}
        title="Escanear QR Code do Veículo para Check-in"
      />

      {/* Formulário de Check-in */}
      {showCheckInForm && vehicleData && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Card className="shadow">
              <Card.Header className="bg-primary-apm text-white">
                <h5 className="mb-0">
                  <FaSignInAlt className="me-2" />
                  Formulário de Check-in
                </h5>
              </Card.Header>
              <Card.Body>
                {/* Informações do veículo */}
                <Alert variant="light" className="border">
                  <Row>
                    <Col md={6}>
                      <p className="mb-1">
                        <strong>Veículo:</strong> {vehicleData.model}
                      </p>
                      <p className="mb-1">
                        <strong>Placa:</strong> {vehicleData.plate}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1">
                        <strong>Marca:</strong> {vehicleData.brand}
                      </p>
                      <p className="mb-1">
                        <strong>Ano:</strong> {vehicleData.year}
                      </p>
                    </Col>
                  </Row>
                </Alert>

                {/* Formulário */}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaTachometerAlt className="me-2" />
                          Quilometragem Atual *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="odometer"
                          value={formData.odometer}
                          onChange={handleChange}
                          placeholder="Ex: 45000"
                          isInvalid={!!errors.odometer}
                          disabled={isSubmitting}
                          min="0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.odometer}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Quilometragem atual do veículo
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaGasPump className="me-2" />
                          Nível de Combustível *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="fuelLevel"
                          value={formData.fuelLevel}
                          onChange={handleChange}
                          placeholder="Ex: 80"
                          isInvalid={!!errors.fuelLevel}
                          disabled={isSubmitting}
                          min="0"
                          max="100"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fuelLevel}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Porcentagem de combustível (0-100%)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaMapMarkerAlt className="me-2" />
                      Local de Retirada *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ex: Garagem Principal"
                      isInvalid={!!errors.location}
                      disabled={isSubmitting}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.location}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FaStickyNote className="me-2" />
                      Observações
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Informe qualquer problema ou observação sobre o veículo..."
                      disabled={isSubmitting}
                    />
                    <Form.Text className="text-muted">
                      Relate problemas encontrados ou informações relevantes
                    </Form.Text>
                  </Form.Group>

                  {/* Botões */}
                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="flex-fill"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Processando...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="me-2" />
                          Confirmar Check-in
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline-secondary"
                      size="lg"
                      onClick={cancelCheckIn}
                      disabled={isSubmitting}
                    >
                      <FaTimes className="me-2" />
                      Cancelar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </Container>
  );
}

export default CheckIn;
