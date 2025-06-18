import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Páginas de Autenticação
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ResetPassword from "./pages/Auth/ResetPassword";

// Páginas Principais
import Dashboard from "./pages/Painel/Dashboard";
import CheckIn from "./pages/CheckIn/CheckIn";
import CheckOut from "./pages/CheckOut/CheckOut";
import ServiceRequest from "./pages/Services/ServiceRequest";
import ServiceHistory from "./pages/Services/ServiceHistory";
import QRCodeViewer from "./pages/QRCodeViewer/QRCodeViewer";

// Componente de rota protegida
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh", backgroundColor: "var(--bg-light)" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="text-muted">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Componente de rota pública
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh", backgroundColor: "var(--bg-light)" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="text-muted">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/painel" replace />;
  }

  return children;
}

// Página 404 personalizada
function NotFound() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "var(--bg-light)" }}
    >
      <div className="text-center">
        <h1 className="display-1 text-primary-apm fw-bold">404</h1>
        <h3 className="mb-3">Página não encontrada</h3>
        <p className="text-muted mb-4">
          A página que você está procurando não existe ou foi movida.
        </p>
        <a 
          href={isAuthenticated ? "/painel" : "/login"} 
          className="btn btn-primary"
        >
          {isAuthenticated ? "Voltar ao Painel" : "Ir para Login"}
        </a>
      </div>
    </div>
  );
}

// Componente principal de rotas
function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas (autenticação) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          </PublicRoute>
        }
      />

      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Rotas protegidas (requer autenticação) */}
      <Route
        path="/painel"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkin"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CheckIn />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CheckOut />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/service-request"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ServiceRequest />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/service-history"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ServiceHistory />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/qr-codes"
        element={
          <ProtectedRoute>
            <MainLayout>
              <QRCodeViewer />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirecionamento da rota antiga */}
      <Route path="/dashboard" element={<Navigate to="/painel" replace />} />

      {/* Rota raiz - redireciona baseado na autenticação */}
      <Route path="/" element={<Navigate to="/painel" replace />} />

      {/* Rota 404 - página não encontrada */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
