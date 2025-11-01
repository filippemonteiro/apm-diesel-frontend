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
import LocalStorageService from "../../services/localStorage"

function CheckIn() {
  const { user: _user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [veiculoData, setVeiculoData] = useState(null);
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
      const response = await ApiService.getVeiculo(decodedText);

      if (response) {
        // Verificar se o veículo está disponível
        if (response.status === "in_use") {
          toast.error("Este veículo já está em uso!");
          return;
        }

        if (response.status === "maintenance") {
          toast.error("Este veículo está em manutenção!");
          return;
        }

        setVeiculoData(response);
        setShowCheckInForm(true);

        // Pré-preencher dados atuais
        setFormData((prev) => ({
          ...prev,
         ...response
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
    if (!formData.km) {
      newErrors.km = "Quilometragem é obrigatória";
    } else if (parseInt(formData.km) < 0) {
      newErrors.km = "Quilometragem inválida";
    }

    // Validar nível de combustível
    if (!formData.combustivel) {
      newErrors.combustivel = "Nível de combustível é obrigatório";
    } else if (formData.combustivel < 0 || formData.combustivel > 100) {
      newErrors.combustivel = "Nível deve estar entre 0 e 100%";
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
        motorista_id: LocalStorageService.getCurrentUser().id,
        veiculo_id: veiculoData.id,
        km: parseInt(formData.km),
        combustivel: parseInt(formData.combustivel),
        location: formData.location.trim(),
        observacao: formData.notes.trim()
      };

      const response = await ApiService.checkIn(checkInData);

      if (response) {
        toast.success(response.message || "Check-in realizado com sucesso!");

        // Resetar formulário
        setVeiculoData(null);
        setShowCheckInForm(false);
        setFormData({
          km: "",
          combustivel: "",
          location: "",
          observacao
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
    setVeiculoData(null);
    setFormData({
      km: "",
      combustivel: "",
      location: "",
      observacao: "",
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
      {showCheckInForm && veiculoData && (
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
                        <strong>Veículo:</strong> {veiculoData.marca} 
                      </p>
                      <p className="mb-1">
                        <strong>Placa:</strong> {veiculoData.placa}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1">
                        <strong>Marca:</strong> {veiculoData.marca}
                      </p>
                      <p className="mb-1">
                        <strong>Ano:</strong> {veiculoData.ano}
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
                          name="km"
                          value={formData.km}
                          onChange={handleChange}
                          placeholder="Ex: 45000"
                          isInvalid={!!errors.km}
                          disabled={isSubmitting}
                          min="0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.km}
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
                          name="combustivel"
                          value={formData.combustivel}
                          onChange={handleChange}
                          placeholder="Ex: 80"
                          isInvalid={!!errors.combustivel}
                          disabled={isSubmitting}
                          min="0"
                          max="100"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.combustivel}
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
                      name="observacao"
                      value={formData.observacao}
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
