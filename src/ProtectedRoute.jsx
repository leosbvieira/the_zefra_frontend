// src/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const devmode = true; // Modo de desenvolvimento, para testes

export default function ProtectedRoute({ children }) {
  if (devmode) {
    return children;
  }
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
// esse é um componente de rota protegida. Ele bloqueia acesso a rotas específicas se o usuário não estiver autenticado. Se o token não estiver presente no armazenamento local, ele redireciona o usuário para a página de login ("/"). Caso contrário, renderiza os filhos (children) da rota protegida.
// Esse componente deve ser usado em torno de rotas que requerem autenticação, como mostrado
