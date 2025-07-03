import React, { useState } from "react";
import { Navbar, Nav, Container, Offcanvas, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaTools,
  FaHistory,
  FaUser,
  FaBars,
  FaInstagram,
  FaMapMarkerAlt,
} from "react-icons/fa";

function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/painel",
      label: "Painel",
      icon: <FaTachometerAlt className="me-2" />,
    },
    {
      path: "/checkin",
      label: "Check-in",
      icon: <FaSignInAlt className="me-2" />,
    },
    {
      path: "/checkout",
      label: "Check-out",
      icon: <FaSignOutAlt className="me-2" />,
    },
    {
      path: "/service-request",
      label: "Solicitar Serviço",
      icon: <FaTools className="me-2" />,
    },
    {
      path: "/service-history",
      label: "Histórico",
      icon: <FaHistory className="me-2" />,
    },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar Principal */}
      <Navbar
        expand="lg"
        style={{
          backgroundColor: "var(--primary-dark)",
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container fluid>
          {/* Logo e Toggle para Mobile */}
          <div className="d-flex align-items-center">
            <Button
              variant="outline-light"
              className="d-lg-none me-3"
              onClick={() => setShowOffcanvas(true)}
              style={{ borderRadius: "8px", border: "none" }}
              aria-label="Menu"
            >
              <FaBars />
            </Button>

            <Link
              to="/painel"
              className="navbar-brand fw-bold d-flex align-items-center text-decoration-none"
              style={{ fontSize: "1.25rem" }}
            >
              <img
                src="/img/logo.svg"
                alt="APM Diesel Logo"
                style={{
                  width: "32px",
                  height: "32px",
                  marginRight: "10px",
                  borderRadius: "6px",
                  objectFit: "cover",
                  transition: "all 0.3s ease",
                }}
                onError={(e) => {
                  e.target.src = "/img/logo.png";
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 6px 20px rgba(26, 31, 58, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 4px 16px rgba(26, 31, 58, 0.2)";
                }}
              />
              <div>
                <div className="text-white">APM Diesel</div>
                <div
                  className="text-gold-apm"
                  style={{ fontSize: "0.65rem", lineHeight: 1 }}
                >
                  Peças e Serviços
                </div>
              </div>
            </Link>
          </div>

          {/* Menu Desktop */}
          <Navbar.Collapse id="navbar-nav" className="d-none d-lg-block">
            <Nav className="me-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link fw-semibold px-3 mx-1 rounded-pill ${
                    isActiveRoute(item.path)
                      ? "bg-gold-apm text-primary-apm"
                      : "text-white"
                  }`}
                  style={{
                    transition: "all 0.3s ease",
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </Nav>
          </Navbar.Collapse>

          {/* SEÇÃO CORRIGIDA - Informações do Usuário */}
          <div className="d-flex align-items-center">
            {/* Informações do Usuário - DESKTOP E TABLET (acima de 992px) */}
            <div className="text-white me-3 d-none d-lg-block text-end">
              <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                {user?.name}
              </div>
              <small className="text-gold-apm" style={{ fontSize: "0.75rem" }}>
                {user?.role === "1" || user?.role === "2"
                  ? "Administrador"
                  : user?.role === "3"
                  ? "Operador"
                  : user?.role === "4"
                  ? "Motorista"
                  : "Usuário"}
              </small>
            </div>

            {/* Informações do Usuário - MOBILE E TABLET (até 991px) */}
            <div className="text-white me-3 d-block d-lg-none">
              <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                {user?.name?.split(" ")[0]} {/* Apenas primeiro nome */}
              </div>
              <small className="text-gold-apm" style={{ fontSize: "0.7rem" }}>
                {user?.role === "1" || user?.role === "2"
                  ? "Admin"
                  : user?.role === "3"
                  ? "Operador"
                  : user?.role === "4"
                  ? "Motorista"
                  : "Usuário"}
              </small>
            </div>

            {/* Dropdown do Usuário - APENAS DESKTOP (acima de 992px) */}
            <div className="dropdown d-none d-lg-block">
              <Button
                variant="outline-light"
                className="dropdown-toggle border-0"
                data-bs-toggle="dropdown"
                style={{
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                aria-expanded="false"
              >
                <FaUser />
              </Button>
              <ul
                className="dropdown-menu dropdown-menu-end shadow border-0"
                style={{ borderRadius: "12px" }}
              >
                <li>
                  <div className="dropdown-item-text px-3 py-2">
                    <div className="fw-bold">{user?.name}</div>
                    <small className="text-muted">{user?.email}</small>
                  </div>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger d-flex align-items-center px-3 py-2"
                    onClick={handleLogout}
                    style={{ borderRadius: "8px" }}
                  >
                    <FaSignOutAlt className="me-2" />
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Offcanvas Menu Mobile - VERSÃO OTIMIZADA */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="start"
        className="mobile-menu-offcanvas"
      >
        <Offcanvas.Header
          closeButton
          style={{ backgroundColor: "var(--primary-dark)", color: "white" }}
        >
          <Offcanvas.Title className="d-flex align-items-center">
            <img
              src="/img/logo.svg"
              alt="APM Diesel Logo"
              style={{
                width: "24px",
                height: "24px",
                marginRight: "8px",
                borderRadius: "4px",
                transition: "all 0.3s ease",
              }}
              onError={(e) => {
                e.target.src = "/img/logo.png";
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 20px rgba(26, 31, 58, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 16px rgba(26, 31, 58, 0.2)";
              }}
            />
            <div>
              <div>APM Diesel</div>
              <small style={{ fontSize: "0.7rem", opacity: 0.8 }}>
                Peças e Serviços
              </small>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body style={{ padding: "1.5rem" }}>
          {/* Informações do usuário no mobile - MELHORADO */}
          <div
            className="text-center mb-4 p-3 rounded-3"
            style={{
              backgroundColor: "var(--primary-dark)",
              color: "white",
            }}
          >
            <FaUser size={48} className="text-gold-apm mb-2" />
            <h6 className="mb-1 text-white">{user?.name}</h6>
            <small className="text-gold-apm">{user?.email}</small>
            <div className="mt-2">
              <span className="badge bg-gold-apm text-dark px-3 py-1">
                {user?.role === "1" || user?.role === "2"
                  ? "Administrador"
                  : user?.role === "3"
                  ? "Operador"
                  : user?.role === "4"
                  ? "Motorista"
                  : "Usuário"}
              </span>
            </div>
          </div>

          {/* Menu items - OTIMIZADO */}
          <Nav className="flex-column gap-2 mb-4">
            {menuItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link-mobile d-flex align-items-center fw-semibold ${
                  isActiveRoute(item.path)
                    ? "nav-link-active"
                    : "nav-link-inactive"
                }`}
                onClick={() => setShowOffcanvas(false)}
                style={{
                  animationDelay: `${(index + 1) * 0.1}s`,
                }}
              >
                <span className="me-3 nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </Nav>

          {/* Botão de logout no mobile - DESTAQUE */}
          <div className="mb-4">
            <Button
              variant="outline-danger"
              className="w-100 d-flex align-items-center justify-content-center py-3"
              onClick={handleLogout}
              style={{
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "1rem",
                transition: "all 0.3s ease",
              }}
            >
              <FaSignOutAlt className="me-2" />
              Sair do Sistema
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Conteúdo Principal */}
      <main
        className="flex-grow-1 main-content"
        style={{ backgroundColor: "var(--bg-light)" }}
      >
        <Container fluid className="py-4">
          {children}
        </Container>
      </main>

      {/* Footer Limpo */}
      <footer
        style={{ backgroundColor: "var(--primary-dark)", color: "white" }}
        className="text-center py-3"
      >
        <Container>
          <div className="d-flex justify-content-center align-items-center gap-4 mb-2">
            <a
              href="https://www.instagram.com/apmdiesel/?hl=pt-br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-apm text-decoration-none d-flex align-items-center gap-2"
            >
              <FaInstagram size={20} />
              <span className="d-none d-sm-inline">Instagram</span>
            </a>
            <a
              href="https://g.co/kgs/WH26CU3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-apm text-decoration-none d-flex align-items-center gap-2"
            >
              <FaMapMarkerAlt size={20} />
              <span className="d-none d-sm-inline">Localização</span>
            </a>
          </div>
          <small style={{ fontSize: "0.8rem" }}>
            APM Diesel - Peças e Serviços |
            <span className="text-gold-apm"> v1.0.0</span>
          </small>
        </Container>
      </footer>
    </div>
  );
}

export default MainLayout;
