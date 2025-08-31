import React, { useState, useEffect } from "react";

export default function Remessas() {
  const [uploadFileType, setUploadFileType] = useState("Aquisicao");
  const [downloadFileType, setDownloadFileType] = useState("Aquisicao");
  const [selectedFund, setSelectedFund] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [fundosDisponiveis, setFundosDisponiveis] = useState([]);

  // Busca a lista de fundos na API ao carregar
  useEffect(() => {
    const fetchFundos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://3.139.69.108/api/fundos/", {
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

  // Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadFileType) {
      alert("Selecione uma tabela e um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", uploadFile);
    formData.append("table_type", uploadFileType);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://3.139.69.108/api/upload_movimentations/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/csv")) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "duplicados.csv";
          a.click();
          window.URL.revokeObjectURL(url);
          alert("Upload concluído com duplicatas.");
        } else {
          const result = await response.json();
          alert(`Upload realizado: ${result.inserted} registros.`);
        }
      } else {
        const error = await response.json();
        alert("Erro no upload: " + (error.detail || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Erro de rede.");
    }
  };

  // Download
  const handleDownload = async () => {
    if (!selectedFund || !startDate || !endDate || !downloadFileType) {
      alert("Preencha todos os campos.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }

    const params = new URLSearchParams({
      fundo: selectedFund,
      start_date: startDate,
      end_date: endDate,
    });

    params.append("tables", `Arquivo${downloadFileType}`);

    try {
      const response = await fetch(
        `http://3.139.69.108/api/download_movimentations/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        alert("Erro no download.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${downloadFileType}_${selectedFund}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro no download:", error);
      alert("Erro de rede.");
    }
  };

  const handleTemplateDownload = (tipo) => {
    const filename = `${tipo.toLowerCase()}_template.csv`;
    const link = document.createElement("a");
    link.href = `/templates/${filename}`; // ajuste se o caminho for diferente
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="p-4 space-y-4 text-[13px]">
      {/* Importação */}
      <div className="mt-4">
        <div className="bg-[#4B8C8F] text-white px-3 py-1.5 font-semibold rounded-t-md text-sm">
          Importação de Arquivo
        </div>
        <div className="rounded-b-md border border-t-0 p-3">
          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label className="block font-medium mb-1">Tipo de Arquivo</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 px-2 h-8 border rounded-md text-sm"
                  value={uploadFileType}
                  onChange={(e) => setUploadFileType(e.target.value)}
                >
                  <option value="Aquisicao">Aquisição</option>
                  <option value="Liquidacao">Liquidação</option>
                </select>
                <button
                  type="button"
                  className="ml-2 bg-gray-200 text-black px-2 py-1 rounded-md text-sm"
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    const res = await fetch(
                      `http://3.139.69.108/api/download_template/?table_type=${uploadFileType}`,
                      {
                        headers: {
                          Authorization: `Token ${token}`,
                        },
                      }
                    );
                    if (res.ok) {
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `template_${uploadFileType}.csv`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    } else {
                      alert("Erro ao baixar template.");
                    }
                  }}
                >
                  Baixar Template
                </button>

              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Upload de Arquivo</label>
              <input
                type="file"
                name="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="w-full px-2 h-8 border rounded-md text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#4B8C8F] text-white px-3 py-1.5 rounded-md text-sm"
              >
                Enviar Arquivo
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Download */}
      <div>
        <div className="bg-[#4B8C8F] text-white px-3 py-1.5 font-semibold rounded-t-md text-sm">
          Download de Arquivos
        </div>
        <div className="rounded-b-md border border-t-0 p-3 space-y-3">
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

          <div>
            <label className="block font-medium mb-1">Tipo de Arquivo</label>
            <select
              className="w-full px-2 h-8 border rounded-md text-sm"
              value={downloadFileType}
              onChange={(e) => setDownloadFileType(e.target.value)}
            >
              <option value="Aquisicao">Aquisição</option>
              <option value="Liquidacao">Liquidação</option>
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">Data Início</label>
              <input
                type="date"
                className="w-full px-2 h-8 border rounded-md text-sm"
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Data Fim</label>
              <input
                type="date"
                className="w-full px-2 h-8 border rounded-md text-sm"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              type="button"
              className="bg-[#4B8C8F] text-white px-3 py-1.5 rounded-md text-sm"
            >
              Download {downloadFileType.charAt(0).toUpperCase() + downloadFileType.slice(1)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}