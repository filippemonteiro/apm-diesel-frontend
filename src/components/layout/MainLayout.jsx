import React, { useState } from 'react';
import { Navbar, Nav, Container, Offcanvas, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaTools, 
  FaHistory, 
  FaUser, 
  FaBars,
  FaInstagram,
  FaMapMarkerAlt
} from 'react-icons/fa';

function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <FaTachometerAlt className="me-2" />
    },
    {
      path: '/checkin',
      label: 'Check-in',
      icon: <FaSignInAlt className="me-2" />
    },
    {
      path: '/checkout',
      label: 'Check-out',
      icon: <FaSignOutAlt className="me-2" />
    },
    {
      path: '/service-request',
      label: 'Solicitar Serviço',
      icon: <FaTools className="me-2" />
    },
    {
      path: '/service-history',
      label: 'Histórico',
      icon: <FaHistory className="me-2" />
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar Principal */}
      <Navbar expand="lg" style={{ backgroundColor: 'var(--primary-dark)', boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)' }}>
        <Container fluid>
          {/* Logo e Toggle para Mobile */}
          <div className="d-flex align-items-center">
            <Button
              variant="outline-light"
              className="d-lg-none me-3"
              onClick={() => setShowOffcanvas(true)}
              style={{ borderRadius: '8px', border: 'none' }}
              aria-label="Menu"
            >
              <FaBars />
            </Button>
            
            <Navbar.Brand 
              href="/dashboard" 
              className="fw-bold d-flex align-items-center"
              style={{ fontSize: '1.25rem' }}
            >
              <img 
                src="/img/logo.svg" 
                alt="APM Diesel Logo" 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  marginRight: '10px',
                  borderRadius: '6px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = "/img/logo.png";
                }}
              />
              <div>
                <div className="text-white">APM Diesel</div>
                <div className="text-gold-apm" style={{ fontSize: '0.65rem', lineHeight: 1 }}>
                  Peças e Serviços
                </div>
              </div>
            </Navbar.Brand>
          </div>

          {/* Menu Desktop */}
          <Navbar.Collapse id="navbar-nav" className="d-none d-lg-block">
            <Nav className="me-auto">
              {menuItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  href={item.path}
                  className={`fw-semibold px-3 mx-1 rounded-pill ${
                    isActiveRoute(item.path) 
                      ? 'bg-gold-apm text-primary-apm' 
                      : 'text-white'
                  }`}
                  style={{ 
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem'
                  }}
                >
                  {item.icon}
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>

          {/* Informações do Usuário */}
          <div className="d-flex align-items-center">
            <div className="text-white me-3 d-none d-md-block text-end">
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.name}</div>
              <small className="text-gold-apm" style={{ fontSize: '0.75rem' }}>
                {user?.role === 'admin' ? 'Administrador' : 
                 user?.role === 'manager' ? 'Gerente' : 'Motorista'}
              </small>
            </div>
            
            <div className="dropdown">
              <Button
                variant="outline-light"
                className="dropdown-toggle border-0"
                data-bs-toggle="dropdown"
                style={{ 
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                aria-expanded="false"
              >
                <FaUser />
              </Button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ borderRadius: '12px' }}>
                <li>
                  <div className="dropdown-item-text px-3 py-2">
                    <div className="fw-bold">{user?.name}</div>
                    <small className="text-muted">{user?.email}</small>
                  </div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item text-danger d-flex align-items-center px-3 py-2"
                    onClick={handleLogout}
                    style={{ borderRadius: '8px' }}
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

      {/* Offcanvas Menu Mobile */}
      <Offcanvas 
        show={showOffcanvas} 
        onHide={() => setShowOffcanvas(false)}
        placement="start"
        style={{ borderRadius: '0' }}
      >
        <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--primary-dark)', color: 'white' }}>
          <Offcanvas.Title className="d-flex align-items-center">
            <img 
              src="/img/logo.svg" 
              alt="APM Diesel Logo" 
              style={{ width: '24px', height: '24px', marginRight: '8px', borderRadius: '4px' }}
              onError={(e) => {
                e.target.src = "/img/logo.png";
              }}
            />
            <div>
              <div>APM Diesel</div>
              <small style={{ fontSize: '0.7rem', opacity: 0.8 }}>Peças e Serviços</small>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Informações do usuário no mobile */}
          <div className="text-center mb-4 p-3 rounded" style={{ backgroundColor: 'var(--bg-light)' }}>
            <FaUser size={48} className="text-primary-apm mb-2" />
            <h6 className="mb-1">{user?.name}</h6>
            <small className="text-muted">{user?.email}</small>
          </div>

          {/* Menu items */}
          <Nav className="flex-column">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.path}
                href={item.path}
                className={`py-3 px-3 mb-2 rounded ${
                  isActiveRoute(item.path) 
                    ? 'bg-primary-apm text-white' 
                    : 'text-dark'
                }`}
                onClick={() => setShowOffcanvas(false)}
                style={{ transition: 'all 0.3s ease' }}
              >
                {item.icon}
                {item.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* Links sociais */}
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-center gap-3 mb-3">
              <a 
                href="https://www.instagram.com/apmdiesel/?hl=pt-br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none text-primary-apm"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https://g.co/kgs/WH26CU3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none text-primary-apm"
              >
                <FaMapMarkerAlt size={24} />
              </a>
            </div>
          </div>

          {/* Botão de Logout */}
          <div className="mt-auto pt-4">
            <Button
              variant="outline-danger"
              className="w-100"
              onClick={handleLogout}
              style={{ borderRadius: '8px' }}
            >
              <FaSignOutAlt className="me-2" />
              Sair
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Conteúdo Principal */}
      <main className="flex-grow-1 main-content" style={{ backgroundColor: 'var(--bg-light)' }}>
        <Container fluid className="py-4">
          {children}
        </Container>
      </main>

      {/* Footer Limpo */}
      <footer style={{ backgroundColor: 'var(--primary-dark)', color: 'white' }} className="text-center py-3">
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
          <small style={{ fontSize: '0.8rem' }}>
            © 2024 APM Diesel - Peças e Serviços | 
            <span className="text-gold-apm"> v1.0.0</span>
          </small>
        </Container>
      </footer>
    </div>
  );
}

export default MainLayout;