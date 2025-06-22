import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Preencha todos os campos");
    } else {
      setError(null);
      console.log("Enviar login", { username, password });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/back.png')" }} // ou qualquer imagem de fundo
    >
      <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="ASDA ZEFRA.png" alt="Logo" className="h-10" />
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Digite seu e-mail</label>
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
            <label className="text-sm font-medium text-gray-700">Digite sua senha</label>
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
