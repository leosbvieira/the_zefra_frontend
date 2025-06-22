// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import VisaoGeral from "./pages/VisaoGeral";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/visao-geral"
          element={
            <Layout>
              <VisaoGeral />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

