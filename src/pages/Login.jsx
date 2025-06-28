import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login inválido");
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token); // salva token
        navigate("/visao-geral"); // redireciona para a página protegida
      } else {
        setError("Usuário ou senha incorretos");
      }
    } catch (err) {
      setError(err.message || "Erro ao conectar com o servidor");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/back.png')" }}
    >
      <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="ASDA ZEFRA.png" alt="Logo" className="h-10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Digite seu e-mail
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Informe seu e-mail"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Digite sua senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Informe sua senha"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full text-white py-2 rounded font-semibold"
            style={{ backgroundColor: "#407479" }}
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
// Esse é o componente de login. Ele renderiza um formulário de login com campos para e-mail e senha. Quando o usuário envia o formulário, ele faz uma requisição POST para o endpoint de login do backend. Se o login for bem-sucedido, ele salva o token no armazenamento local e redireciona o usuário para a página protegida ("/visao-geral"). Se houver algum erro, ele exibe uma mensagem de erro.
// O componente também inclui validação básica para garantir que os campos não estejam vazios antes de enviar a requisição. Se os campos estiverem vazios, ele exibe uma mensagem de erro

