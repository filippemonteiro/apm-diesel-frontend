import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function BackButton({ to = "/painel", label = "Voltar ao Painel", variant = "outline-secondary", className = "" }) {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      onClick={() => navigate(to)}
      className={`d-inline-flex align-items-center ${className}`}
    >
      <FaArrowLeft className="me-2" />
      {label}
    </Button>
  );
}

export default BackButton;
