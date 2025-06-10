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
import Dashboard from "./pages/Dashboard/Dashboard";
import CheckIn from "./pages/CheckIn/CheckIn";
import CheckOut from "./pages/CheckOut/CheckOut";
import ServiceRequest from "./pages/Services/ServiceRequest";
import ServiceHistory from "./pages/Services/ServiceHistory";

// Componente de rota protegida
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Componente de rota pública (só acessa se não estiver logado)
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
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
        path="/dashboard"
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

      {/* Rota raiz - redireciona baseado na autenticação */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Rota 404 - página não encontrada */}
      <Route
        path="*"
        element={
          <div
            className="container-fluid d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="text-center">
              <h1 className="display-4 text-primary-aupm">404</h1>
              <p className="lead">Página não encontrada</p>
              <a href="/dashboard" className="btn btn-primary">
                Voltar ao Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
