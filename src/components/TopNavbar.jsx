import { Settings, LogOut, Folder, Layers } from "lucide-react"; // ⬅️ Ícone novo
import { Link, useLocation } from "react-router-dom";


const tabMap = {
  Remessas: ["ImportExport","Status", "Estoque"],
};

const tabLabels = {
  ImportExport: "Remessas",
  Status: "Status de Remessas",
  Estoque: "Estoque",
};


export default function TopNavbar({ section, activeTab, setActiveTab }) {
  const tabs = tabMap[section] || [];
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  return (
    <header className="fixed top-0 left-[60px] right-0 bg-white border-b border-gray-200 z-30">
      {/* Top Row: título e botões */}
      <div className="flex items-center justify-between h-[48px] px-6">
        <div className="flex items-center gap-3">
          {/* ⬇️ Novo card visual com ícone */}
          <div className="flex items-center gap-2 bg-[#1E1F25] text-white px-4 py-2.5 rounded-xl border border-[#4B8C8F] shadow-md">
            <Layers size={16} className="text-[#4B8C8F]" />
            <h1 className="text-sm font-semibold">{section}</h1>
          </div>
        </div>

        {/* Botões canto direito */}
        <div className="bg-[#1E1F25] rounded-full px-3 py-1.5 shadow-sm border border-gray-200 flex items-center space-x-2">
          <button className="p-1.5 rounded-full hover:bg-white/10 text-white">
            <Settings size={16} />
          </button>
          <button
            className="p-1.5 rounded-full hover:bg-white/10 text-white"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Abas */}
      {tabs.length > 0 && (
        <div className="flex justify-start border-t border-gray-100 px-6">
          <nav className="flex gap-6 text-sm font-medium text-gray-500 py-2">
            {tabs.map((tab) => {
              const isActive =
                section === "Remessas"
                  ? path.includes(tab.toLowerCase())
                  : activeTab === tab;

              return section === "Remessas" ? (
                <Link
                  key={tab}
                  to={`/${tab.toLowerCase()}`}
                  className={`relative pb-2 transition-colors ${
                    isActive
                      ? "text-[#4B8C8F] after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-0.5 after:bg-[#4B8C8F]"
                      : "hover:text-gray-700"
                  }`}
                >
                  {tabLabels[tab] || tab}
                </Link>
              ) : (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-2 transition-colors ${
                    isActive
                      ? "text-[#4B8C8F] after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-0.5 after:bg-[#4B8C8F]"
                      : "hover:text-gray-700"
                  }`}
                >
                  {tabLabels[tab] || tab}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}





