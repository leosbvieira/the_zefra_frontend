import React, { useState } from "react";

export default function Remessas() {
  const [uploadFileType, setUploadFileType] = useState("aquisição");
  const [downloadFileType, setDownloadFileType] = useState("aquisição");
  const [selectedFund, setSelectedFund] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await fetch("http://3.139.69.108/upload_movimentations", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Upload realizado com sucesso!");
      } else {
        alert("Erro no upload.");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Erro de rede.");
    }
  };

  const handleDownload = async () => {
    if (!selectedFund || !startDate || !endDate || !downloadFileType) {
      alert("Preencha todos os campos.");
      return;
    }

    const params = new URLSearchParams({
      fundo: selectedFund,
      tipo: downloadFileType,
      data_inicio: startDate,
      data_fim: endDate,
    });

    try {
      const response = await fetch(`http://3.139.69.108/downloadmovimentações?${params.toString()}`, {
        method: "GET",
      });

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
              <select
                className="w-full px-2 h-8 border rounded-md text-sm"
                value={uploadFileType}
                onChange={(e) => setUploadFileType(e.target.value)}
              >
                <option value="aquisição">Aquisição</option>
                <option value="liquidação">Liquidação</option>
              </select>
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
              <option value="fundoA">Fundo A</option>
              <option value="fundoB">Fundo B</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Tipo de Arquivo</label>
            <select
              className="w-full px-2 h-8 border rounded-md text-sm"
              value={downloadFileType}
              onChange={(e) => setDownloadFileType(e.target.value)}
            >
              <option value="aquisição">Aquisição</option>
              <option value="liquidação">Liquidação</option>
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
