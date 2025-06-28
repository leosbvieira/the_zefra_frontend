// src/pages/VisaoGeral.jsx
import { useEffect } from "react";
import TopNavbar from "../components/TopNavbar.jsx";

export default function VisaoGeral() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.plot.ly/plotly-latest.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">

        <main className="flex-1 pt-[72px] p-6 bg-transparent overflow-y-auto flex justify-center">

          <div className="w-full max-w-5xl">
            <h1 className="text-2xl font-semibold mb-4">Visão Geral</h1>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white shadow-md p-6 rounded">
                <p className="text-2xl font-bold text-center">R$ 10.000.000</p>
                <p className="text-center text-gray-600">Patrimônio Líquido</p>
              </div>
              <div className="bg-white shadow-md p-6 rounded">
                <p className="text-2xl font-bold text-center">R$ 8.500.000</p>
                <p className="text-center text-gray-600">Ativos Líquidos</p>
              </div>
            </div>

            {/* Aqui poderiam vir os gráficos com Plotly futuramente */}
          </div>
        </main>
      </div>
    </div>
  );
}