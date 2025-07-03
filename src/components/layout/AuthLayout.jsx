import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaInstagram, FaMapMarkerAlt } from "react-icons/fa";

function AuthLayout({ children }) {
  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        overflow: "auto",
        background:
          "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-gold) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem 0",
      }}
    >
      <Container>
        <Row
          className="justify-content-center align-items-center"
          style={{
            minHeight: "100vh",
            padding: "2rem 0",
          }}
        >
          {/* CORREÇÃO: Largura do Card Responsiva */}
          <Col xs={12} sm={10} md={9} lg={7} xl={5}>
            {/* Card Principal - Com Largura Otimizada */}
            <Card
              style={{
                borderRadius: "18px",
                border: "none",
                boxShadow: "0 16px 48px rgba(0,0,0,0.1)",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.98)",
                marginBottom: "2rem",
              }}
            >
              <Card.Body className="p-3 p-sm-4 p-md-5">{children}</Card.Body>
            </Card>

            {/* Footer Compacto */}
            <div className="text-center mt-3">
              <div className="d-flex justify-content-center align-items-center gap-3 mb-2">
                <a
                  href="https://www.instagram.com/apmdiesel/?hl=pt-br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none d-flex align-items-center gap-2"
                  style={{
                    fontSize: "0.85rem",
                    transition: "all 0.3s ease",
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.color = "var(--primary-gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "0.8";
                    e.target.style.color = "white";
                  }}
                >
                  <FaInstagram size={16} />
                  Instagram
                </a>

                <div
                  style={{
                    width: "1px",
                    height: "14px",
                    backgroundColor: "rgba(255,255,255,0.3)",
                  }}
                ></div>

                <a
                  href="https://g.co/kgs/WH26CU3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none d-flex align-items-center gap-2"
                  style={{
                    fontSize: "0.85rem",
                    transition: "all 0.3s ease",
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.color = "var(--primary-gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "0.8";
                    e.target.style.color = "white";
                  }}
                >
                  <FaMapMarkerAlt size={16} />
                  Localização
                </a>
              </div>

              <small
                className="text-white"
                style={{ fontSize: "0.8rem", opacity: 0.7 }}
              >
                APM Diesel - Peças e Serviços | v1.0.0
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AuthLayout;
