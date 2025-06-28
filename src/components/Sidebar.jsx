import { useState } from "react";
import {
  LayoutDashboard,
  BarChart2,
  Layers,
  Settings,
  Repeat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: "Gestão" },
  { icon: <BarChart2 size={20} />, label: "Analytics", badge: "Beta" },
  { icon: <Layers size={20} />, label: "Remessas" },
  { icon: <Repeat size={20} />, label: "Conversores" },
];

export default function Sidebar({ setSection }) {
  const navigate = useNavigate();
  const [activeLabel, setActiveLabel] = useState("Dashboard Ativos");

  const handleClick = (label) => {
    setActiveLabel(label);
    setSection(label);
    switch (label) {
      case "Dashboard Ativos":
        navigate("/visao-geral");
        break;
      case "Remessas":
        navigate("/remessas");
        break;
      case "Analytics":
        navigate("/analytics"); // se existir
        break;
      case "Gestão":
        navigate("/gestao"); // se existir
        break;
      case "Conversores":
        navigate("/conversores"); // se existir
        break;

      default:
        break;
    }
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-[60px] h-screen bg-[#1E1F25] text-white flex flex-col justify-between items-center py-3">
      {/* Top Logo */}
      <div className="mb-4">
        <img
          src="/log_branco_zef.png"
          alt="Logo"
          className="h- w-8 object-contain"
        />
      </div>
      {/* Linha separadora */}
      <div className="w-10 border-t border-white/30 mb-2 mx-auto" />

      {/* Menu */}
      <nav className="flex-1 flex flex-col items-center gap-1 mt-1 w-full">
        {menuItems.map((item, index) => {
          const isActive = item.label === activeLabel;
          return (
            <div
              key={index}
              className={`w-full flex flex-col items-center gap-0.5 py-1.2 cursor-pointer text-[9px] transition-colors ${isActive ? "bg-[#4B8C8F] text-bg-[#4B8C8F]" : "hover:bg-white/10"
                }`}
              onClick={() => handleClick(item.label)}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="text-center leading-tight">
                {item.label}
                {item.badge && (
                  <span className="block text-[9px] text-purple-400">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom User Icon */}
      <div className="w-16 h-10 bg-white flex items-center justify-center mt-4">
        <img
          src="/iter.png"
          alt="Logo"
          className="h-7 w-full object-contain px-2"
        />
      </div>


    </aside>
  );
}
