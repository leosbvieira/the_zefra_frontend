// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import VisaoGeral from "./pages/VisaoGeral";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import ImportExport from "./pages/ImportExport";

// ✅ Subpáginas de Status de Remessas
import StatusRemessas from "./pages/status/StatusRemessas";
import Pendentes from "./pages/status/Pendentes";
import Finalizados from "./pages/status/Finalizados";

import Estoque from "./pages/Estoque";
import EmConstrucao from "./pages/EmConstrucao";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/visao-geral"
          element={
            <ProtectedRoute>
              <Layout>
                <VisaoGeral />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Remessas (sua tela de upload etc.) */}
        <Route
          path="/ImportExport"
          element={
            <ProtectedRoute>
              <Layout>
                <ImportExport />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ✅ Status de Remessas com rotas aninhadas */}
        <Route
          path="/status"
          element={
            <ProtectedRoute>
              <Layout>
                <StatusRemessas />
              </Layout>
            </ProtectedRoute>
          }
        >
          {/* /status → redireciona para /status/pendentes */}
          <Route index element={<Navigate to="pendentes" replace />} />
          <Route path="pendentes" element={<Pendentes />} />
          <Route path="finalizados" element={<Finalizados />} />
        </Route>

        <Route
          path="/estoque"
          element={
            <ProtectedRoute>
              <Layout>
                <Estoque />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout>
                <EmConstrucao />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


