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
} from "react-bootstrap";
import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaUserTie,
  FaUserShield,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import ApiService from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function UserManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para modais
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para busca e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Estados para formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "4", // Motorista por padrão
    ativo: "1",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Verificar permissões
  useEffect(() => {
    if (!user?.role || (user.role !== "admin" && user.role !== "1")) {
      toast.error("Você não tem permissão para acessar esta página.");
      navigate("/painel");
      return;
    }
    loadUsers();
  }, [user, navigate]);

  // Carregar lista de usuários
  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await ApiService.getUsers();
      console.log("Usuários carregados:", response);

      // Verificar estrutura da resposta
      if (response.data) {
        setUsers(response.data);
      } else if (Array.isArray(response)) {
        setUsers(response);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setError("Erro ao carregar lista de usuários.");
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuários baseado na busca e filtros
  const filteredUsers = users.filter((userItem) => {
    const matchesSearch =
      !searchTerm ||
      userItem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !roleFilter || userItem.role === roleFilter;
    const matchesStatus = !statusFilter || userItem.ativo === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Abrir modal para novo usuário
  const handleNewUser = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "4", // Motorista por padrão
      ativo: "1",
    });
    setShowFormModal(true);
  };

  // Abrir modal para editar usuário
  const handleEditUser = (userItem) => {
    setIsEditing(true);
    setSelectedUser(userItem);
    setFormData({
      name: userItem.name || "",
      email: userItem.email || "",
      password: "", // Não mostrar senha atual
      confirmPassword: "",
      role: userItem.role || "4",
      ativo: userItem.ativo || "1",
    });
    setShowFormModal(true);
  };

  // Confirmar exclusão
  const handleDeleteConfirm = (userItem) => {
    if (userItem.id === user.id) {
      toast.error("Você não pode excluir sua própria conta!");
      return;
    }
    setSelectedUser(userItem);
    setShowDeleteModal(true);
  };

  // Executar exclusão
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await ApiService.deleteUser(selectedUser.id);
      toast.success("Usuário excluído com sucesso!");
      setShowDeleteModal(false);
      setSelectedUser(null);
      loadUsers(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error(error.message || "Erro ao excluir usuário");
    }
  };

  // Validar formulário
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email é obrigatório");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Email inválido");
      return false;
    }

    if (!isEditing) {
      if (!formData.password) {
        toast.error("Senha é obrigatória");
        return false;
      }

      if (formData.password.length < 6) {
        toast.error("Senha deve ter pelo menos 6 caracteres");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Senhas não coincidem");
        return false;
      }
    } else if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      toast.error("Senhas não coincidem");
      return false;
    }

    return true;
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormLoading(true);

    try {
      const submitData = { ...formData };

      // Se estiver editando e senha estiver vazia, remover do payload
      if (isEditing && !submitData.password) {
        delete submitData.password;
        delete submitData.confirmPassword;
      }

      if (isEditing && selectedUser) {
        await ApiService.updateUser(selectedUser.id, submitData);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await ApiService.createUser(submitData);
        toast.success("Usuário cadastrado com sucesso!");
      }

      setShowFormModal(false);
      loadUsers(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.error(error.message || "Erro ao salvar usuário");
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

  // Renderizar badge de role
  const renderRoleBadge = (role) => {
    const roleConfig = {
      1: { variant: "danger", text: "Super Admin", icon: FaUserShield },
      2: { variant: "warning", text: "Admin", icon: FaUserTie },
      3: { variant: "info", text: "Operador", icon: FaUser },
      4: { variant: "primary", text: "Motorista", icon: FaUser },
    };

    const config = roleConfig[role] || {
      variant: "secondary",
      text: "Usuário",
      icon: FaUser,
    };
    const IconComponent = config.icon;

    return (
      <Badge bg={config.variant} className="d-flex align-items-center">
        <IconComponent className="me-1" size={12} />
        {config.text}
      </Badge>
    );
  };

  // Renderizar badge de status
  const renderStatusBadge = (ativo) => {
    return (
      <Badge bg={ativo === "1" ? "success" : "danger"}>
        {ativo === "1" ? "Ativo" : "Inativo"}
      </Badge>
    );
  };

  return (
    <Container className="mt-4">
      <BackButton />

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <FaUsers className="me-2" />
                Gerenciamento de Usuários
              </h2>
              <p className="text-muted mb-0">
                Gerencie usuários e permissões do sistema
              </p>
            </div>
            <Button variant="primary" onClick={handleNewUser}>
              <FaPlus className="me-2" />
              Novo Usuário
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Todas as Funções</option>
            <option value="1">Super Admin</option>
            <option value="2">Admin</option>
            <option value="3">Operador</option>
            <option value="4">Motorista</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
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
          <p className="mt-2">Carregando usuários...</p>
        </div>
      ) : (
        <Card>
          <Card.Header>
            <h5 className="mb-0">Lista de Usuários ({filteredUsers.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-5">
                <FaUsers size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Nenhum usuário encontrado</h5>
                <p className="text-muted">
                  {searchTerm || roleFilter || statusFilter
                    ? "Tente ajustar os filtros de busca"
                    : "Clique em 'Novo Usuário' para começar"}
                </p>
              </div>
            ) : (
              <Table responsive striped hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Função</th>
                    <th>Status</th>
                    <th>Criado em</th>
                    <th width="150">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((userItem) => (
                    <tr key={userItem.id}>
                      <td>
                        <strong>{userItem.name}</strong>
                        {userItem.id === user.id && (
                          <Badge bg="info" className="ms-2" size="sm">
                            Você
                          </Badge>
                        )}
                      </td>
                      <td>{userItem.email}</td>
                      <td>{renderRoleBadge(userItem.role)}</td>
                      <td>{renderStatusBadge(userItem.ativo)}</td>
                      <td>
                        {userItem.created_at
                          ? new Date(userItem.created_at).toLocaleDateString(
                              "pt-BR"
                            )
                          : "-"}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditUser(userItem)}
                            title="Editar"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteConfirm(userItem)}
                            title="Excluir"
                            disabled={userItem.id === user.id}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite o nome completo"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="usuario@email.com"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Senha {isEditing ? "(deixe vazio para manter atual)" : "*"}
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!isEditing}
                      placeholder={
                        isEditing ? "Nova senha (opcional)" : "Digite uma senha"
                      }
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Senha *</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isEditing || formData.password}
                    placeholder="Confirme a senha"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Função *</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="4">Motorista</option>
                    <option value="3">Operador</option>
                    <option value="2">Admin</option>
                    {user?.role === "1" && (
                      <option value="1">Super Admin</option>
                    )}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Defina o nível de acesso do usuário
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="ativo"
                    value={formData.ativo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
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
            <h5>Tem certeza que deseja excluir este usuário?</h5>
            {selectedUser && (
              <p className="text-muted">
                <strong>{selectedUser.name}</strong>
                <br />
                Email: {selectedUser.email}
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
            Excluir Usuário
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserManagement;
