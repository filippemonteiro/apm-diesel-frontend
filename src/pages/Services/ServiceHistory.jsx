import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Alert,
  Table,
  Spinner,
  Badge,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaHistory,
  FaCar,
  FaTools,
  FaGasPump,
  FaWrench,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import BackButton from "../../components/common/BackButton";
import { useAuth } from "../../context/AuthContext";
import ApiService from '../../services/api'
function ServiceHistory() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState({
    data_inicio: "",
    data_fim: "",
    tipo: "",
    veiculo_id: "",
  });
  const [veiculos, setVeiculos] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      if (!user) return;

      setLoading(true);
      setError("");
      try {
        const data = await ApiService.getReservas();
        setReservas(data.data)
        try {
         
        } catch (error) {
          console.error("Erro ao carregar veículos:", error);
        }
      } catch (error) {
        setError("Erro de conexão");
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [user]);

  const aplicarFiltros = async () => {
    if (!user) return;

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");

      // Construir URL com filtros
      const data = await ApiService.getReservas();
      setReservas(data.data)
    } catch (error) {
      setError("Erro de conexão");
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      data_inicio: "",
      data_fim: "",
      tipo: "",
      veiculo_id: "",
    });
    // Recarregar dados sem filtros
    setTimeout(() => {
      aplicarFiltros();
    }, 100);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      AGENDADO: { variant: "warning", text: "Agendado" },
      EM_ANDAMENTO: { variant: "info", text: "Em Andamento" },
      CONCLUIDO: { variant: "success", text: "Concluído" },
      CANCELADO: { variant: "danger", text: "Cancelado" },
    };

    const statusInfo = statusMap[status] || {
      variant: "secondary",
      text: status,
    };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const getTipoIcon = (tipo) => {
    if (
      tipo?.toLowerCase().includes("abastecimento") ||
      tipo?.toLowerCase().includes("combustivel")
    ) {
      return <FaGasPump className="text-primary me-1" />;
    }
    return <FaWrench className="text-warning me-1" />;
  };

  const formatDateTime = (data, hora) => {
    try {
      const date = new Date(data);
      return `${date.toLocaleDateString("pt-BR")} ${hora || ""}`;
    } catch {
      return `${data} ${hora || ""}`;
    }
  };

  const formatCurrency = (valor) => {
    if (!valor) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <Container>
      <div className="mb-3">
        <BackButton />
      </div>

      <div className="text-center mb-4">
        <h2 className="text-primary-apm">
          <FaHistory className="me-2" />
          Histórico de Serviços
        </h2>
        <p className="text-muted">
          Visualize o histórico completo de solicitações de serviços
        </p>
      </div>

      {/* Filtros */}
      <Card className="shadow mb-4">
        <Card.Header className="bg-light">
          <h6 className="mb-0">
            <FaFilter className="me-2" />
            Filtros
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Data Início</Form.Label>
                <Form.Control
                  type="date"
                  name="data_inicio"
                  value={filtros.data_inicio}
                  onChange={handleFiltroChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Data Fim</Form.Label>
                <Form.Control
                  type="date"
                  name="data_fim"
                  value={filtros.data_fim}
                  onChange={handleFiltroChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Serviço</Form.Label>
                <Form.Control
                  as="select"
                  name="tipo"
                  value={filtros.tipo}
                  onChange={handleFiltroChange}
                >
                  <option value="">Todos os tipos</option>
                  <option value="Abastecimento">Abastecimento</option>
                  <option value="Manutenção">Manutenção</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Veículo</Form.Label>
                <Form.Control
                  as="select"
                  name="veiculo_id"
                  value={filtros.veiculo_id}
                  onChange={handleFiltroChange}
                >
                  <option value="">Todos os veículos</option>
                  {veiculos.map((veiculo) => (
                    <option key={veiculo.id} value={veiculo.id}>
                      {veiculo.marca} {veiculo.modelo} - {veiculo.cor}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={aplicarFiltros}>
              <FaSearch className="me-1" />
              Aplicar Filtros
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={limparFiltros}
            >
              Limpar
            </button>
          </div>
        </Card.Body>
      </Card>

      {/* Tabela de Histórico */}
      <div className="row">
        <div className="col-12">
          <Card className="shadow">
            <Card.Header className="bg-primary-apm text-white">
              <h5 className="mb-0">
                <FaHistory className="me-2" />
                Histórico de Serviços ({reservas.length} registros)
              </h5>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Carregando histórico...</p>
                </div>
              ) : reservas.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <FaHistory className="me-2" />
                  Nenhum serviço encontrado para os filtros selecionados.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead className="table-dark">
                      <tr>
                        <th>Data/Hora</th>
                        <th>Tipo</th>
                        <th>Veículo</th>
                        <th>Motorista</th>
                        <th>Valor</th>
                        <th>KM</th>
                        <th>Status</th>
                        
                        <th>Observação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map((reserva) => (
                        <tr key={reserva.id}>
                          <td>{formatDateTime(reserva.data, reserva.hora)}</td>
                          <td>
                            {getTipoIcon(reserva.tipo)}
                            {reserva.tipo}
                          </td>
                          <td>
                            {reserva.veiculo
                              ? `${reserva.veiculo.marca} ${reserva.veiculo.modelo} - ${reserva.veiculo.cor}`
                              : "Veículo não encontrado"}

                            <br />
                            <strong>Data e Hora:</strong>
                            <br />
                            {reserva.data_hora_checkin} - {reserva.data_hora_checkout}
                          </td>
                          <td>
                            {reserva.motorista
                              ? reserva.motorista.name
                              : "Motorista não encontrado"}
                          </td>
                          <td>{formatCurrency(reserva.valor)}</td>
                          <td>{reserva.km ? `${reserva.km} km` : "-"}</td>
                          <td>{getStatusBadge(reserva.status)}</td>
                          
                          <td></td>
                          <td>
                            {reserva.observacao ? (
                              <span
                                title={reserva.observacao}
                                style={{ cursor: "help" }}
                              >
                                {reserva.observacao.length > 30
                                  ? reserva.observacao.substring(0, 30) + "..."
                                  : reserva.observacao}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default ServiceHistory;
