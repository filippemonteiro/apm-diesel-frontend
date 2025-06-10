import React from "react";
import { Container, Card, Alert, Table } from "react-bootstrap";
import { FaHistory, FaCar, FaTools } from "react-icons/fa";

function ServiceHistory() {
  return (
    <Container>
      <div className="text-center mb-4">
        <h2 className="text-primary-apm">
          <FaHistory className="me-2" />
          Histórico de Atividades
        </h2>
        <p className="text-muted">
          Visualize o histórico de check-ins, check-outs e solicitações
        </p>
      </div>

      <div className="row">
        <div className="col-12">
          <Card className="shadow">
            <Card.Header className="bg-primary-apm text-white">
              <h5 className="mb-0">
                <FaHistory className="me-2" />
                Histórico Completo
              </h5>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                <strong>Em desenvolvimento:</strong>
                <br />
                Esta página mostrará o histórico completo de atividades dos
                veículos.
              </Alert>

              {/* Tabela de exemplo */}
              <Table responsive striped hover>
                <thead className="table-dark">
                  <tr>
                    <th>Data</th>
                    <th>Ação</th>
                    <th>Veículo</th>
                    <th>Usuário</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>15/01/2024 08:30</td>
                    <td>
                      <FaCar className="text-success me-1" />
                      Check-in
                    </td>
                    <td>ABC-1234</td>
                    <td>João Silva</td>
                    <td>
                      <span className="badge bg-success">Concluído</span>
                    </td>
                  </tr>
                  <tr>
                    <td>15/01/2024 17:45</td>
                    <td>
                      <FaCar className="text-warning me-1" />
                      Check-out
                    </td>
                    <td>ABC-1234</td>
                    <td>João Silva</td>
                    <td>
                      <span className="badge bg-success">Concluído</span>
                    </td>
                  </tr>
                  <tr>
                    <td>16/01/2024 09:00</td>
                    <td>
                      <FaTools className="text-info me-1" />
                      Solicitação
                    </td>
                    <td>GHI-9012</td>
                    <td>João Silva</td>
                    <td>
                      <span className="badge bg-warning">Pendente</span>
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Alert variant="light" className="mt-3">
                <small className="text-muted">
                  <strong>Funcionalidades planejadas:</strong>
                  <br />
                  • Filtros por data, veículo e tipo de ação
                  <br />
                  • Exportação para Excel/PDF
                  <br />
                  • Gráficos e relatórios
                  <br />• Histórico detalhado com fotos e observações
                </small>
              </Alert>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default ServiceHistory;
