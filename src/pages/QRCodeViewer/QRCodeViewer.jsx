import React from "react";
import QRCodeGenerator from "../../components/common/QRCodeGenerator";
import BackButton from "../../components/common/BackButton";
import { Container } from "react-bootstrap";

function QRCodeViewer() {
  return (
    <div>
      <Container>
        <div className="mb-3">
          <BackButton />
        </div>
      </Container>
      <QRCodeGenerator />
    </div>
  );
}

export default QRCodeViewer;
