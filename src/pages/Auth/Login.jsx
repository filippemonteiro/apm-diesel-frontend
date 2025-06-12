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
  FaUser,
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
        navigate("/painel");
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
        navigate("/painel");
      }
    } catch (err) {
      toast.error("Erro no login de demonstração");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Logo e Nome Principal - Compacto */}
      <div className="text-center mb-4">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <img
            src="/img/logo.svg"
            alt="APM Diesel Logo"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(26, 31, 58, 0.25)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onError={(e) => {
              e.target.src = "/img/logo.png";
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 12px 32px rgba(26, 31, 58, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 8px 24px rgba(26, 31, 58, 0.25)";
            }}
          />
          <div className="text-start ms-3">
            <h1
              className="text-primary-apm fw-bold mb-0"
              style={{
                fontSize: "1.75rem",
                letterSpacing: "-0.3px",
                lineHeight: 1.1,
              }}
            >
              APM Diesel
            </h1>
            <p
              className="mb-0"
              style={{
                fontSize: "0.95rem",
                fontWeight: "500",
                color: "var(--primary-gold)",
              }}
            >
              Peças e Serviços
            </p>
          </div>
        </div>
        <div
          className="mx-auto"
          style={{
            width: "40px",
            height: "2px",
            background:
              "linear-gradient(90deg, var(--primary-dark) 0%, var(--primary-gold) 100%)",
            borderRadius: "1px",
            marginBottom: "0.5rem",
          }}
        ></div>
        <p
          className="text-muted mb-0"
          style={{
            fontSize: "0.85rem",
            fontWeight: "400",
          }}
        >
          Sistema de Controle de Frota
        </p>
      </div>

      {/* Alertas de erro global */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Formulário Compacto */}
      <Form onSubmit={handleSubmit}>
        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label
            className="fw-semibold text-dark mb-2"
            style={{ fontSize: "0.9rem" }}
          >
            <FaEnvelope className="me-2 text-primary-apm" size={14} />
            Email
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu email"
            isInvalid={!!errors.email}
            disabled={isSubmitting || isLoading}
            autoComplete="email"
            style={{
              fontSize: "0.95rem",
              padding: "12px 14px",
              border: "2px solid var(--border-light)",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}
          />
          <Form.Control.Feedback type="invalid" style={{ fontSize: "0.8rem" }}>
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Senha */}
        <Form.Group className="mb-3">
          <Form.Label
            className="fw-semibold text-dark mb-2"
            style={{ fontSize: "0.9rem" }}
          >
            <FaLock className="me-2 text-primary-apm" size={14} />
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
              style={{
                fontSize: "0.95rem",
                padding: "12px 45px 12px 14px",
                border: "2px solid var(--border-light)",
                borderRadius: "10px",
                transition: "all 0.3s ease",
              }}
            />
            <Button
              variant="link"
              className="position-absolute end-0 top-50 translate-middle-y border-0"
              style={{
                zIndex: 10,
                padding: "6px 10px",
                color: "var(--text-muted)",
              }}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting || isLoading}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </Button>
          </div>
          <Form.Control.Feedback type="invalid" style={{ fontSize: "0.8rem" }}>
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Link de recuperação */}
        <div className="d-flex justify-content-end mb-3">
          <Link
            to="/reset-password"
            className="text-decoration-none text-primary-apm"
            style={{
              fontSize: "0.85rem",
              fontWeight: "500",
              transition: "color 0.3s ease",
            }}
          >
            Esqueceu sua senha?
          </Link>
        </div>

        {/* Botão de submit compacto */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-100 mb-3"
          disabled={isSubmitting || isLoading}
          style={{
            padding: "14px",
            fontSize: "1rem",
            fontWeight: "600",
            borderRadius: "10px",
            boxShadow: "0 3px 12px rgba(26, 31, 58, 0.2)",
            transition: "all 0.3s ease",
          }}
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
            "Entrar no Sistema"
          )}
        </Button>

        {/* Divisor compacto */}
        <div className="position-relative my-3">
          <hr
            style={{
              margin: 0,
              border: "none",
              height: "1px",
              background: "var(--border-light)",
            }}
          />
          <div
            className="position-absolute top-50 start-50 translate-middle px-2"
            style={{ backgroundColor: "white" }}
          >
            <small className="text-muted" style={{ fontSize: "0.8rem" }}>
              contas demo
            </small>
          </div>
        </div>

        {/* Botões de demonstração compactos */}
        <div className="d-grid gap-2 mb-3">
          <Button
            variant="outline-primary"
            onClick={() => handleDemoLogin("admin")}
            disabled={isSubmitting || isLoading}
            style={{
              padding: "10px 14px",
              fontSize: "0.9rem",
              fontWeight: "500",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}
          >
            <FaUser className="me-2" size={14} />
            Admin
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => handleDemoLogin("driver")}
            disabled={isSubmitting || isLoading}
            style={{
              padding: "10px 14px",
              fontSize: "0.9rem",
              fontWeight: "500",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}
          >
            <FaUser className="me-2" size={14} />
            Motorista
          </Button>
        </div>

        {/* Link para cadastro compacto */}
        <div
          className="text-center pt-2"
          style={{ borderTop: "1px solid var(--border-light)" }}
        >
          <p className="mb-0" style={{ fontSize: "0.9rem" }}>
            Não possui conta?{" "}
            <Link
              to="/signup"
              className="text-decoration-none text-primary-apm fw-semibold"
              style={{
                transition: "color 0.3s ease",
              }}
            >
              Criar conta
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default Login;
