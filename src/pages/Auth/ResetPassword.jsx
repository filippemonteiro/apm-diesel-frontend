import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaArrowLeft,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { resetPassword, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();

  // Limpar erros quando o componente monta
  useEffect(() => {
    clearError();
  }, []); // Array de dependências vazio

  // Manipular mudança no input de email
  const handleChange = (e) => {
    setEmail(e.target.value);

    // Limpar erro quando usuário começar a digitar
    if (errors.email) {
      setErrors({});
    }
  };

  // Validar email
  const validateEmail = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setIsEmailSent(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reenviar email
  const handleResendEmail = async () => {
    setIsSubmitting(true);

    try {
      const result = await resetPassword(email);
      if (result.success) {
        toast.success("Email reenviado com sucesso!");
      }
    } catch (err) {
      toast.error("Erro ao reenviar email");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se email foi enviado, mostrar tela de confirmação
  if (isEmailSent) {
    return (
      <div className="fade-in text-center">
        {/* Ícone de sucesso */}
        <div className="mb-4">
          <FaCheckCircle size={60} className="text-success mb-3" />
          <h4 className="text-primary-apm fw-bold mb-2">Email Enviado!</h4>
          <p className="text-muted">
            Enviamos instruções para recuperação de senha para:
          </p>
          <p className="fw-semibold text-primary-apm">{email}</p>
        </div>

        {/* Instruções */}
        <Alert variant="info" className="text-start">
          <h6 className="alert-heading">Próximos passos:</h6>
          <ol className="mb-0 ps-3">
            <li>Verifique sua caixa de entrada</li>
            <li>Clique no link recebido por email</li>
            <li>Defina uma nova senha</li>
            <li>Faça login com suas novas credenciais</li>
          </ol>
        </Alert>

        {/* Ações */}
        <div className="d-grid gap-2">
          <Button
            variant="outline-primary"
            onClick={handleResendEmail}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Reenviando...
              </>
            ) : (
              <>
                <FaPaperPlane className="me-2" />
                Reenviar Email
              </>
            )}
          </Button>

          <Button
            variant="link"
            onClick={() => navigate("/login")}
            className="text-primary-apm"
          >
            <FaArrowLeft className="me-2" />
            Voltar ao Login
          </Button>
        </div>

        {/* Nota sobre spam */}
        <div className="mt-4">
          <small className="text-muted">
            <strong>Não recebeu o email?</strong>
            <br />
            Verifique sua pasta de spam ou lixo eletrônico.
          </small>
        </div>
      </div>
    );
  }

  // Formulário de recuperação
  return (
    <div className="fade-in">
      {/* Título */}
      <div className="text-center mb-4">
        <h4 className="text-primary-apm fw-bold mb-2">
          <FaEnvelope className="me-2" />
          Recuperar Senha
        </h4>
        <p className="text-muted">
          Digite seu email para receber instruções de recuperação
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
        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">
            <FaEnvelope className="me-2" />
            Email
          </Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="Digite seu email cadastrado"
            isInvalid={!!errors.email}
            disabled={isSubmitting || isLoading}
            autoComplete="email"
            autoFocus
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            Enviaremos um link de recuperação para este email
          </Form.Text>
        </Form.Group>

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
              Enviando...
            </>
          ) : (
            <>
              <FaPaperPlane className="me-2" />
              Enviar Instruções
            </>
          )}
        </Button>

        {/* Links de navegação */}
        <div className="text-center">
          <Link
            to="/login"
            className="text-decoration-none text-primary-apm d-flex align-items-center justify-content-center"
          >
            <FaArrowLeft className="me-2" />
            Voltar ao Login
          </Link>
        </div>
      </Form>

      {/* Informações adicionais */}
      <hr className="my-4" />

      <Alert variant="light" className="text-center">
        <small className="text-muted">
          <strong>Precisa de ajuda?</strong>
          <br />
          Entre em contato com o suporte em:
          <br />
          <a href="mailto:suporte@apmdiesel.com" className="text-primary-apm">
            suporte@apmdiesel.com
          </a>
        </small>
      </Alert>
    </div>
  );
}

export default ResetPassword;
