import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  FileText,
} from "lucide-react";

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const [openSections, setOpenSections] = useState({}); 

  const toggleSection = (label) => {                    
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };
  const sections = [
    {
      label: "Remessas", icon: <Briefcase size={20} />,
      children: ["Aquisição", "Liquidação"],
    },
    { label: "Estoque", icon: <FileText size={20} /> },
    {
      label: "Conversores",
      icon: <FolderKanban size={20} />,
      children: ["CNAB", "XML"],
    },
  
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-40 bg-white border-r shadow-md transition-all duration-300 flex flex-col ${isExpanded ? "w-60" : "w-20"
        }`}
    >
      {/* Logo + Botão de expandir/recolher */}
      <div className="relative p-4 flex items-center justify-center">
        <img
          src={isExpanded ? "/ASDA ZEFRA.png" : "/zeeffraa.png"}
          className="h-10 w-auto object-contain"
          alt="Logo"
        />

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
        >
          {isExpanded ? (
            <ChevronLeft size={18} className="text-gray-500" />
          ) : (
            <ChevronRight size={16} className="text-gray-500" />
          )}
        </button>
      </div>
      <div className="border-b border-gray-200 my-2" /> 

      {/* Botão fixo de dashboard 
        <div className="px-4 mb-4">
          <button className="bg-[#338BA8] text-white w-full py-2 rounded-full text-sm font-medium shadow hover:bg-[#2b7b96] transition">
            Dashboard
          </button>
        </div>
      )}*/}

      {/* Lista de menus */}
      <ul className="space-y-1 px-2 text-sm font-medium flex-1 overflow-y-auto">
        {sections.map((item, idx) => (
          <li key={idx}>
            <div
              onClick={() => item.children && toggleSection(item.label)}
              className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-[#d0e9f1] transition group"
            >
              <div className="w-5 mr-3 text-[#338BA8]">{item.icon}</div>
              {isExpanded && <span>{item.label}</span>}
              {item.children && isExpanded && (
                <span className="ml-auto text-gray-500 group-hover:text-[#338BA8]">
                  {openSections[item.label] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
              )}
            </div>
            {item.children && isExpanded && openSections[item.label] && (
              <ul className="ml-10 mt-1 text-sm text-gray-500 space-y-1">
                {item.children.map((subItem, i) => (
                  <li key={i}>
                    <Link
                      to="#"
                      className="block hover:text-[#338BA8] transition"
                    >
                      {subItem}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className="p-4 text-xs text-gray-400 text-center">
        {/* Rodapé (opcional) */}
      </div>
    </div>
  );
};

export default Sidebar;
