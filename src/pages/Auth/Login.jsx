import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  // Limpar erros quando o componente monta
  useEffect(() => {
    clearError();
  }, []); // Array de dependências vazio para executar apenas uma vez

  // Manipular mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro específico quando usuário começar a digitar
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

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
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
      const result = await login(formData);

      if (result.success) {
        toast.success(result.message);
        navigate("/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Login com dados de demonstração
  const handleDemoLogin = async (userType) => {
    const demoCredentials = {
      admin: { email: "admin@apmdiesel.com", password: "123456" },
      driver: { email: "motorista@apmdiesel.com", password: "123456" },
    };

    const credentials = demoCredentials[userType];
    setFormData(credentials);

    setIsSubmitting(true);
    try {
      const result = await login(credentials);
      if (result.success) {
        toast.success(
          `Login como ${userType === "admin" ? "Administrador" : "Motorista"}`
        );
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Erro no login de demonstração");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Logo e Nome Principal */}
      <div className="text-center mb-5">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <img 
            src="/img/logo.svg" 
            alt="APM Diesel Logo" 
            style={{ 
              width: '80px', 
              height: '80px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginRight: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
            onError={(e) => {
              e.target.src = "/img/logo.png";
            }}
          />
          <div className="text-start">
            <h2 className="text-primary-apm fw-bold mb-1" style={{ fontSize: '2rem' }}>
              APM Diesel
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
              Peças e Serviços
            </p>
          </div>
        </div>
        <div className="text-center">
          <small className="text-muted" style={{ fontSize: '0.9rem' }}>
            Sistema de Controle de Frota
          </small>
        </div>
      </div>

      {/* Alertas de erro global */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Formulário */}
      <Form onSubmit={handleSubmit}>
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

        {/* Senha */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">
            <FaLock className="me-2" />
            Senha
          </Form.Label>
          <div className="position-relative">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              isInvalid={!!errors.password}
              disabled={isSubmitting || isLoading}
              autoComplete="current-password"
            />
            <Button
              variant="link"
              className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
              style={{ zIndex: 10 }}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting || isLoading}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </div>
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Link de recuperação */}
        <div className="d-flex justify-content-end mb-3">
          <Link
            to="/reset-password"
            className="text-decoration-none small text-primary-apm"
          >
            Esqueceu sua senha?
          </Link>
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
              Entrando...
            </>
          ) : (
            <>
              <FaSignInAlt className="me-2" />
              Entrar
            </>
          )}
        </Button>

        {/* Divisor */}
        <hr className="my-4" />

        {/* Botões de demonstração */}
        <div className="text-center mb-3">
          <small className="text-muted d-block mb-3" style={{ fontSize: '0.85rem' }}>
            Contas de demonstração:
          </small>
          <div className="d-grid gap-2">
            <Button
              variant="outline-primary"
              onClick={() => handleDemoLogin("admin")}
              disabled={isSubmitting || isLoading}
            >
              Entrar como Administrador
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => handleDemoLogin("driver")}
              disabled={isSubmitting || isLoading}
            >
              Entrar como Motorista
            </Button>
          </div>
        </div>

        {/* Link para cadastro */}
        <div className="text-center">
          <p className="mb-0">
            Não tem uma conta?{" "}
            <Link
              to="/signup"
              className="text-decoration-none text-primary-apm fw-semibold"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default Login;