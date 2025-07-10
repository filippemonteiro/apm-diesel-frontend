import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Alert,
  Spinner,
  Modal,
  Form,
  InputGroup,
  ButtonGroup,
} from "react-bootstrap";
import {
  FaCar,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaQrcode,
  FaGasPump,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import ApiService from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function VehicleManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para modais
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para busca e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Estados para formulário
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    placa: "",
    ano: "",
    cor: "",
    combustivel: "",
    status: "disponivel",
    observacoes: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Verificar permissões
  useEffect(() => {
    if (
      !user?.role ||
      (user.role !== "admin" &&
        user.role !== "manager" &&
        user.role !== "1" &&
        user.role !== "2")
    ) {
      toast.error("Você não tem permissão para acessar esta página.");
      navigate("/painel");
      return;
    }
    loadVehicles();
  }, [user, navigate]);

  // Carregar lista de veículos
  const loadVehicles = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await ApiService.getVehicles();
      console.log("Veículos carregados:", response);

      // Verificar estrutura da resposta
      if (response.data) {
        setVehicles(response.data);
      } else if (Array.isArray(response)) {
        setVehicles(response);
      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      setError("Erro ao carregar lista de veículos.");
      toast.error("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar veículos baseado na busca e filtros
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      !searchTerm ||
      vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.placa?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Abrir modal para novo veículo
  const handleNewVehicle = () => {
    setIsEditing(false);
    setSelectedVehicle(null);
    setFormData({
      marca: "",
      modelo: "",
      placa: "",
      ano: "",
      cor: "",
      combustivel: "",
      status: "disponivel",
      observacoes: "",
    });
    setShowFormModal(true);
  };

  // Abrir modal para editar veículo
  const handleEditVehicle = (vehicle) => {
    setIsEditing(true);
    setSelectedVehicle(vehicle);
    setFormData({
      marca: vehicle.marca || "",
      modelo: vehicle.modelo || "",
      placa: vehicle.placa || "",
      ano: vehicle.ano || "",
      cor: vehicle.cor || "",
      combustivel: vehicle.combustivel || "",
      status: vehicle.status || "disponivel",
      observacoes: vehicle.observacoes || "",
    });
    setShowFormModal(true);
  };

  // Confirmar exclusão
  const handleDeleteConfirm = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  // Executar exclusão
  const handleDelete = async () => {
    if (!selectedVehicle) return;

    try {
      await ApiService.deleteVehicle(selectedVehicle.id);
      toast.success("Veículo excluído com sucesso!");
      setShowDeleteModal(false);
      setSelectedVehicle(null);
      loadVehicles(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao excluir veículo:", error);
      toast.error(error.message || "Erro ao excluir veículo");
    }
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (isEditing && selectedVehicle) {
        await ApiService.updateVehicle(selectedVehicle.id, formData);
        toast.success("Veículo atualizado com sucesso!");
      } else {
        await ApiService.createVehicle(formData);
        toast.success("Veículo cadastrado com sucesso!");
      }

      setShowFormModal(false);
      loadVehicles(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
      toast.error(error.message || "Erro ao salvar veículo");
    } finally {
      setFormLoading(false);
    }
  };

  // Mudar campo do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Renderizar badge de status
  const renderStatusBadge = (status) => {
    const statusConfig = {
      disponivel: { variant: "success", text: "Disponível" },
      em_uso: { variant: "primary", text: "Em Uso" },
      manutencao: { variant: "warning", text: "Manutenção" },
      indisponivel: { variant: "danger", text: "Indisponível" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      text: status,
    };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  // Renderizar layout mobile (Cards) - VERSÃO APRIMORADA
  const renderMobileLayout = () => (
    <div className="d-block d-md-none">
      {filteredVehicles.map((vehicle) => (
        <Card key={vehicle.id} className="mb-3 shadow-sm border-0">
          <Card.Body className="p-4">
            {/* Header - Placa e Status */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="flex-grow-1 me-3">
                <h6
                  className="mb-2 fw-bold text-primary-apm"
                  style={{ fontSize: "1.1rem" }}
                >
                  {vehicle.placa}
                </h6>
                <div className="text-dark mb-1">
                  <strong>
                    {vehicle.marca} {vehicle.modelo}
                  </strong>
                </div>
                {vehicle.cor && vehicle.ano && (
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {vehicle.cor} • {vehicle.ano}
                  </small>
                )}
              </div>
              <div className="text-end">
                {renderStatusBadge(vehicle.status)}
              </div>
            </div>

            {/* Info Row - Combustível e Ano */}
            <div className="d-flex align-items-center mb-3 text-muted">
              <FaGasPump className="me-2" size={16} />
              <span className="me-3" style={{ fontSize: "0.9rem" }}>
                {vehicle.combustivel || "N/A"}
              </span>
              {vehicle.ano && (
                <>
                  <FaCalendarAlt className="me-2" size={16} />
                  <span style={{ fontSize: "0.9rem" }}>{vehicle.ano}</span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 pt-2 border-top">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleEditVehicle(vehicle)}
                title="Editar veículo"
                className="flex-fill d-flex align-items-center justify-content-center"
                style={{ minHeight: "36px" }}
              >
                <FaEdit className="me-1" size={14} />
                <span>Editar</span>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteConfirm(vehicle)}
                title="Excluir veículo"
                className="flex-fill d-flex align-items-center justify-content-center"
                style={{ minHeight: "36px" }}
              >
                <FaTrash className="me-1" size={14} />
                <span>Excluir</span>
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  // Renderizar layout desktop (Tabela)
  const renderDesktopLayout = () => (
    <div className="d-none d-md-block">
      <Table responsive striped hover className="mb-0">
        <thead className="table-dark">
          <tr>
            <th>Placa</th>
            <th>Marca/Modelo</th>
            <th>Ano</th>
            <th>Combustível</th>
            <th>Status</th>
            <th width="150">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>
                <strong>{vehicle.placa}</strong>
              </td>
              <td>
                {vehicle.marca} {vehicle.modelo}
                {vehicle.cor && (
                  <small className="text-muted d-block">
                    Cor: {vehicle.cor}
                  </small>
                )}
              </td>
              <td>{vehicle.ano}</td>
              <td>{vehicle.combustivel}</td>
              <td>{renderStatusBadge(vehicle.status)}</td>
              <td>
                <div className="d-flex gap-1">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditVehicle(vehicle)}
                    title="Editar"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteConfirm(vehicle)}
                    title="Excluir"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Container className="mt-4">
      <BackButton />

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div className="flex-grow-1">
              <h2 className="mb-1">
                <FaCar className="me-2" />
                Gerenciamento de Veículos
              </h2>
              <p className="text-muted mb-0">
                Gerencie a frota de veículos da empresa
              </p>
            </div>
            <div className="align-self-stretch align-self-md-center">
              <Button
                variant="primary"
                onClick={handleNewVehicle}
                className="w-100 w-md-auto d-flex align-items-center justify-content-center"
                style={{ minWidth: "140px" }}
              >
                <FaPlus className="me-2" />
                <span className="d-none d-sm-inline">Novo Veículo</span>
                <span className="d-inline d-sm-none">Novo</span>
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por modelo, marca ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="disponivel">Disponível</option>
            <option value="em_uso">Em Uso</option>
            <option value="manutencao">Manutenção</option>
            <option value="indisponivel">Indisponível</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Conteúdo Principal */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Carregando veículos...</p>
        </div>
      ) : (
        <Card>
          <Card.Header>
            <h5 className="mb-0">
              Lista de Veículos ({filteredVehicles.length})
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-5">
                <FaCar size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Nenhum veículo encontrado</h5>
                <p className="text-muted">
                  {searchTerm || statusFilter
                    ? "Tente ajustar os filtros de busca"
                    : "Clique em 'Novo Veículo' para começar"}
                </p>
              </div>
            ) : (
              <>
                {/* Layout Mobile - Cards */}
                {renderMobileLayout()}

                {/* Layout Desktop - Tabela */}
                {renderDesktopLayout()}
              </>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Modal de Formulário */}
      <Modal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar Veículo" : "Novo Veículo"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marca *</Form.Label>
                  <Form.Control
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Ford, Mercedes-Benz"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Modelo *</Form.Label>
                  <Form.Control
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Transit, Sprinter"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Placa *</Form.Label>
                  <Form.Control
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleInputChange}
                    required
                    placeholder="ABC-1234"
                    maxLength={8}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ano</Form.Label>
                  <Form.Control
                    type="number"
                    name="ano"
                    value={formData.ano}
                    onChange={handleInputChange}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    placeholder="2023"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cor</Form.Label>
                  <Form.Control
                    type="text"
                    name="cor"
                    value={formData.cor}
                    onChange={handleInputChange}
                    placeholder="Branco, Azul, etc."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Combustível</Form.Label>
                  <Form.Select
                    name="combustivel"
                    value={formData.combustivel}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione...</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Flex">Flex</option>
                    <option value="Elétrico">Elétrico</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="em_uso">Em Uso</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="indisponivel">Indisponível</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                placeholder="Informações adicionais sobre o veículo..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFormModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={formLoading}>
              {formLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Salvando...
                </>
              ) : (
                <>{isEditing ? "Atualizar" : "Cadastrar"}</>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FaTrash size={48} className="text-danger mb-3" />
            <h5>Tem certeza que deseja excluir este veículo?</h5>
            {selectedVehicle && (
              <p className="text-muted">
                <strong>
                  {selectedVehicle.marca} {selectedVehicle.modelo}
                </strong>
                <br />
                Placa: {selectedVehicle.placa}
              </p>
            )}
            <Alert variant="warning" className="mt-3">
              <small>⚠️ Esta ação não pode ser desfeita!</small>
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Excluir Veículo
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default VehicleManagement;
