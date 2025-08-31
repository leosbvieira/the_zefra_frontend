import React, { useState, useEffect } from "react";

export default function Estoque() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFund, setSelectedFund] = useState("");
  const [fundosDisponiveis, setFundosDisponiveis] = useState([]);
  const [selectedRule, setSelectedRule] = useState("");
  const [filePosicao, setFilePosicao] = useState(null);
  

  // Carrega fundos da API
  useEffect(() => {
    const fetchFundos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("https://www.zefrahub.com/api/fundos/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFundosDisponiveis(data);
        } else {
          console.error("Erro ao carregar fundos");
        }
      } catch (err) {
        console.error("Erro de rede ao buscar fundos:", err);
      }
    };

    fetchFundos();
  }, []);

  // Download de estoque
  const handleDownload = async () => {
    if (!selectedDate || !selectedFund) {
      alert("Preencha todos os campos.");
      return;
    }
    console.log("🔍 Parâmetros enviados:");
    console.log("fundo:", selectedFund);
    console.log("data:", selectedDate);


    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }

    const params = new URLSearchParams({
      fundo: selectedFund,
      data: selectedDate,
    });

    try {
      const response = await fetch(`https://www.zefrahub.com/api/downloadestoque/?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        alert("Erro no download.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `estoque_${selectedFund}_${selectedDate}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro no download:", error);
      alert("Erro de rede.");
    }
  };
  const handleUploadPosicao = async () => {
  if (!selectedDate || !selectedFund || !selectedRule || !filePosicao) {
    alert("Preencha todos os campos e selecione o arquivo.");
    return;
  }

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", filePosicao);
  formData.append("data", selectedDate);
  formData.append("fundo", selectedFund);
  formData.append("regra", selectedRule);

  try {
    const response = await fetch("https://www.zefrahub.com/api/upload_posicao/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert("Arquivo enviado com sucesso.");
    } else {
      const error = await response.json();
      alert("Erro no envio: " + (error.detail || "Erro desconhecido"));
    }
  } catch (error) {
    console.error("Erro no envio:", error);
    alert("Erro de rede.");
  }
};

  return (
    <div className="p-8 space-y-4 text-[13px]">
      <div>
        <div className="bg-[#4B8C8F] text-white px-3 py-1.5 font-semibold rounded-t-md text-sm">
          Download de Estoque
        </div>
        <div className="rounded-b-md border border-t-0 p-3 space-y-3">
          <div>
            <label className="block font-medium mb-1">Data</label>
            <input
              type="date"
              className="w-full px-2 h-8 border rounded-md text-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Selecionar Fundo</label>
            <select
              className="w-full px-2 h-8 border rounded-md text-sm"
              value={selectedFund}
              onChange={(e) => setSelectedFund(e.target.value)}
            >
              <option value="">Selecione...</option>
              {fundosDisponiveis.map((fundo) => (
                <option key={fundo} value={fundo}>
                  {fundo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              type="button"
              className="bg-[#4B8C8F] text-white px-3 py-1.5 rounded-md text-sm"
            >
              Baixar Estoque
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-[#4B8C8F] text-white px-3 py-1.5 font-semibold rounded-t-md text-sm">
          Download Contratos
        </div>
        <div className="rounded-b-md border border-t-0 p-3 space-y-3">
          {/* Data */}
          <div>
            <label className="block font-medium mb-1">Data</label>
            <input
              type="date"
              className="w-full px-2 h-8 border rounded-md text-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Regras */}
          <div>
            <label className="block font-medium mb-1">Filtro Contratos</label>
            <select
              className="w-full px-2 h-8 border rounded-md text-sm"
              value={selectedRule}
              onChange={(e) => setSelectedRule(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="abertas_mes">Vencidos e Mês Atual</option>
              <option value="contrato_inteiro">Contrato inteiro</option>
            </select>
          </div>

          {/* Upload */}
          <div>
            <label className="block font-medium mb-1">Seleção de Contratos</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFilePosicao(e.target.files[0])}
              className="w-full px-2 h-8 border rounded-md text-sm"
            />
          </div>

          {/* Botão de Enviar */}
          <div className="flex justify-end">
            <button
              onClick={handleUploadPosicao}
              type="button"
              className="bg-[#4B8C8F] text-white px-3 py-1.5 rounded-md text-sm"
            >
              Enviar Posição
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
