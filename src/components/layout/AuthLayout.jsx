import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';

function AuthLayout({ children }) {
  return (
    <div 
      className="auth-page"
      style={{
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-gold) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            {/* Card Principal - Design Limpo */}
            <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <Card.Body className="p-4 p-md-5">
                {children}
              </Card.Body>
            </Card>

            {/* Footer Minimalista */}
            <div className="text-center mt-3">
              <div className="d-flex justify-content-center align-items-center gap-3 mb-2">
                <a 
                  href="https://www.instagram.com/apmdiesel/?hl=pt-br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none d-flex align-items-center gap-2"
                  style={{ 
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-gold)'}
                  onMouseLeave={(e) => e.target.style.color = 'white'}
                >
                  <FaInstagram size={16} />
                  Instagram
                </a>
                
                <span className="text-white-50">•</span>
                
                <a 
                  href="https://g.co/kgs/WH26CU3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none d-flex align-items-center gap-2"
                  style={{ 
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-gold)'}
                  onMouseLeave={(e) => e.target.style.color = 'white'}
                >
                  <FaMapMarkerAlt size={16} />
                  Localização
                </a>
              </div>
              
              <small className="text-white-50" style={{ fontSize: '0.75rem' }}>
                © 2024 APM Diesel - Peças e Serviços
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AuthLayout;