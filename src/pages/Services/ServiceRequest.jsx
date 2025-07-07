import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { FaTools, FaGasPump, FaWrench, FaCheck, FaTimes } from "react-icons/fa";
import BackButton from "../../components/common/BackButton";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/api";

function ServiceRequest() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Dados do formulário
  const [formData, setFormData] = useState({
    tipo: "",
    data: "",
    hora: "",
    observacao: "",
    km: "",
    valor: "",
    veiculo_id: "",
  });

  // Dados carregados das APIs
  const [veiculos, setVeiculos] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Carregar dados quando abrir o modal
  useEffect(() => {
    if (showModal) {
      loadData();
    }
  }, [showModal]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      // Usar fetch direto com a URL correta
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://api.controllcar.com.br/api/veiculos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const veiculosData = await response.json();
        setVeiculos(veiculosData.data || []);
      } else {
        console.error(
          "Erro ao carregar veículos:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleServiceClick = (type) => {
    setServiceType(type);
    setFormData({
      tipo: type === "combustivel" ? "Abastecimento" : "Manutenção",
      data: new Date().toISOString().split("T")[0], // Data atual
      hora: new Date().toTimeString().split(" ")[0].substring(0, 5), // Hora atual
      observacao: "",
      km: "",
      valor: "",
      veiculo_id: "",
    });
    setShowModal(true);
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Preparar dados para envio
      const submitData = {
        ...formData,
        motorista_id: user.id,
      };

      const response = await fetch(
        "https://api.controllcar.com.br/api/servicos",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao solicitar serviço");
      }
    } catch (error) {
      setError("Erro de conexão. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
              <div className="row g-4">
                <div className="col-md-6">
                  <Card className="h-100 border-primary">
                    <Card.Body className="text-center">
                      <FaGasPump size={50} className="text-primary mb-3" />
                      <h5>Combustível</h5>
                      <p className="text-muted">Solicitar abastecimento</p>
                      <Button
                        variant="primary"
                        onClick={() => handleServiceClick("combustivel")}
                      >
                        Solicitar
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
                      <Button
                        variant="warning"
                        onClick={() => handleServiceClick("manutencao")}
                      >
                        Solicitar
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Modal de Solicitação */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {serviceType === "combustivel" ? (
              <>
                <FaGasPump className="me-2 text-primary" />
                Solicitar Combustível
              </>
            ) : (
              <>
                <FaWrench className="me-2 text-warning" />
                Solicitar Manutenção
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success ? (
            <Alert variant="success" className="text-center">
              <FaCheck className="me-2" />
              Solicitação enviada com sucesso!
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="danger">
                  <FaTimes className="me-2" />
                  {error}
                </Alert>
              )}

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Serviço</Form.Label>
                    <Form.Control
                      type="text"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Veículo *</Form.Label>
                    {loadingData ? (
                      <Form.Control as="select" disabled>
                        <option>Carregando veículos...</option>
                      </Form.Control>
                    ) : (
                      <Form.Control
                        as="select"
                        name="veiculo_id"
                        value={formData.veiculo_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selecione um veículo</option>
                        {veiculos.map((veiculo) => (
                          <option key={veiculo.id} value={veiculo.id}>
                            {veiculo.marca} {veiculo.modelo} - {veiculo.cor}
                          </option>
                        ))}
                      </Form.Control>
                    )}
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Data *</Form.Label>
                    <Form.Control
                      type="date"
                      name="data"
                      value={formData.data}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Hora *</Form.Label>
                    <Form.Control
                      type="time"
                      name="hora"
                      value={formData.hora}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Quilometragem</Form.Label>
                    <Form.Control
                      type="number"
                      name="km"
                      value={formData.km}
                      onChange={handleInputChange}
                      placeholder="KM atual do veículo"
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Valor Estimado</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="valor"
                      value={formData.valor}
                      onChange={handleInputChange}
                      placeholder="R$ 0,00"
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="observacao"
                  value={formData.observacao}
                  onChange={handleInputChange}
                  placeholder={
                    serviceType === "combustivel"
                      ? "Descrição do abastecimento necessário..."
                      : "Descrição do problema ou serviço necessário..."
                  }
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant={
                    serviceType === "combustivel" ? "primary" : "warning"
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Solicitação"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ServiceRequest;
