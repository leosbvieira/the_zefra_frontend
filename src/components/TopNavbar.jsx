import { useState } from "react";
import { ChevronDown, Settings, LogOut } from "lucide-react";


const TopNavbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const menuItems = [
    { label: "Fundos" },
    { label: "Arquivos" },
    {
      label: "Análise de Ativos"
      //dropdown: ["Blog", "Help Center", "Webinars"],
    },
  ];

  return (
    <div className="w-full h-16 relative flex items-center font-sans  border-gray-200 px-4 bg-transparent">



      {/* 🟧 Espaço reservado pro sidebar */}
      <div className="w-[200px]" />

      {/* 🟦 Parte da direita (continua no fluxo flex) */}
      <div className="ml-auto h-full flex items-center justify-end">
        <div className="bg-[#338BA8] rounded-full px-4 py-2 shadow-sm border border-gray-200 flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100 text-white">
            <Settings size={18} />
          </button>
          {/* Botão de logout */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-white"
            onClick={() => {
              localStorage.removeItem("token"); // Remove o token do armazenamento local
              window.location.href = "/"; // Redireciona para a página de login
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* ⚪ Parte central absoluta deslocada */}
      <div className="absolute left-[48%] -translate-x-1/2 z-10 flex items-center space-x-4 max-w-[800px]">
        <div className="bg-[#338BA8] rounded-full px-4 py-2 shadow-sm border border-gray-200 flex items-center space-x-4">

          {/* Logo 
          <div className="flex items-center space-x-2 pl-1 pr-4 border-r border-gray-400 h-full min-w-[100px] ">
            <img src="/iter.png" alt="Logo" className="h-9 object-contain" />
          </div>
          */}

          {/* Menu */}
          <div className="flex items-center space-x-1">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-white flex items-center px-4 py-2 rounded-full hover:bg-gray-100 hover:text-[#338BA8] text-sm font-medium text-gray-800 whitespace-nowrap">
                  {item.label}
                  {item.dropdown && <ChevronDown size={16} className="ml-1" />}
                </button>
                {item.dropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded shadow-md z-50 py-2">
                    {item.dropdown.map((sub, i) => (
                      <a
                        key={i}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>

  );
};

export default TopNavbar;

