import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaUserPlus,
  FaIdCard
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.DRIVER
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  // Limpar erros quando o componente monta
  useEffect(() => {
    clearError();
  }, []); // Array de dependências vazio

  // Manipular mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro específico quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    // Validar confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    // Validar função
    if (!formData.role) {
      newErrors.role = 'Selecione uma função';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    clearError();
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        toast.success(result.message);
        toast.info('Agora você pode fazer login com suas credenciais');
        navigate('/login');
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Título */}
      <div className="text-center mb-4">
        <h4 className="text-primary-apm fw-bold mb-2">
          <FaUserPlus className="me-2" />
          Criar Conta
        </h4>
        <p className="text-muted">
          Cadastre-se para acessar o sistema
        </p>
      </div>

      {/* Alertas de erro global */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Formulário */}
      <Form onSubmit={handleSubmit}>
        {/* Nome Completo */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">
            <FaUser className="me-2" />
            Nome Completo
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite seu nome completo"
            isInvalid={!!errors.name}
            disabled={isSubmitting || isLoading}
            autoComplete="name"
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">
            <FaEnvelope className="me-2" />
            Email
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            isInvalid={!!errors.email}
            disabled={isSubmitting || isLoading}
            autoComplete="email"
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Função/Cargo */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">
            <FaIdCard className="me-2" />
            Função
          </Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            isInvalid={!!errors.role}
            disabled={isSubmitting || isLoading}
          >
            <option value="">Selecione sua função</option>
            <option value={USER_ROLES.DRIVER}>Motorista</option>
            <option value={USER_ROLES.MANAGER}>Gerente</option>
            <option value={USER_ROLES.ADMIN}>Administrador</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.role}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            Sua função determinará suas permissões no sistema
          </Form.Text>
        </Form.Group>

        {/* Senhas lado a lado no desktop */}
        <Row>
          <Col md={6}>
            {/* Senha */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <FaLock className="me-2" />
                Senha
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Digite uma senha"
                  isInvalid={!!errors.password}
                  disabled={isSubmitting || isLoading}
                  autoComplete="new-password"
                />
                <Button
                  variant="link"
                  className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                  style={{ zIndex: 10 }}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || isLoading}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            {/* Confirmar Senha */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <FaLock className="me-2" />
                Confirmar Senha
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirme a senha"
                  isInvalid={!!errors.confirmPassword}
                  disabled={isSubmitting || isLoading}
                  autoComplete="new-password"
                />
                <Button
                  variant="link"
                  className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                  style={{ zIndex: 10 }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting || isLoading}
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Política de privacidade */}
        <div className="mb-3">
          <Form.Text className="text-muted small">
            Ao criar uma conta, você concorda com nossos termos de uso e política de privacidade.
          </Form.Text>
        </div>

        {/* Botão de submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-100 mb-3"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Criando conta...
            </>
          ) : (
            <>
              <FaUserPlus className="me-2" />
              Criar Conta
            </>
          )}
        </Button>

        {/* Link para login */}
        <div className="text-center">
          <p className="mb-0">
            Já tem uma conta?{' '}
            <Link 
              to="/login" 
              className="text-decoration-none text-primary-apm fw-semibold"
            >
              Faça login
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default SignUp;