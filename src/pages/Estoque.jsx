import React, { useState } from "react";

export default function Estoque() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFund, setSelectedFund] = useState("");

  const handleDownload = async () => {
    if (!selectedDate || !selectedFund) {
      alert("Preencha todos os campos.");
      return;
    }

    const params = new URLSearchParams({
      fundo: selectedFund,
      data: selectedDate,
    });

    try {
      const response = await fetch(`http://3.139.69.108/downloadestoque?${params.toString()}`, {
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

  return (
    <div className="p-4 space-y-4 text-[13px]">
      <div className="w-full border-b pb-1 flex gap-4 text-sm"></div>

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
              <option value="fundoA">Fundo A</option>
              <option value="fundoB">Fundo B</option>
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
    </div>
  );
}
