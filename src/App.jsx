// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import VisaoGeral from "./pages/VisaoGeral";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import Remessas from "./pages/Remessas";
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
        <Route
          path="/remessas"
          element={
            <ProtectedRoute>
              <Layout>
                <Remessas />
              </Layout>
            </ProtectedRoute>
          }
        />
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

