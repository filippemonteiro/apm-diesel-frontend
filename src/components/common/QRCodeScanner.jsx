import React, { useRef, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaQrcode, FaTimes } from "react-icons/fa";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-toastify";

function QRCodeScanner({ show, onHide, onScanSuccess, title }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (show) {
      initializeScanner();
    }

    return () => {
      cleanupScanner();
    };
  }, [show]);

  const initializeScanner = () => {
    setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner("qr-reader", {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 10,
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
        });

        scannerRef.current = scanner;
        scanner.render(handleScanSuccess, handleScanError);
      } catch (error) {
        console.error("Erro ao iniciar scanner:", error);
        toast.error("Erro ao acessar a câmera. Verifique as permissões.");
        onHide();
      }
    }, 100);
  };

  const cleanupScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (error) {
        console.log("Scanner já foi limpo");
      }
    }

    const scanner = document.getElementById("qr-reader");
    if (scanner) {
      scanner.innerHTML = "";
    }
  };

  const handleScanSuccess = (decodedText) => {
    cleanupScanner();
    onScanSuccess(decodedText);
  };

  const handleScanError = (error) => {
    // Ignorar erros comuns de scan
    if (error?.includes("NotFoundException")) {
      return;
    }
    console.warn(error);
  };

  const handleClose = () => {
    cleanupScanner();
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FaQrcode className="me-2" />
          {title || "Escanear QR Code"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="qr-reader" style={{ width: "100%" }}></div>
        {show && (
          <div className="text-center mt-3">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Procurando por QR Code...</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FaTimes className="me-2" />
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QRCodeScanner;
