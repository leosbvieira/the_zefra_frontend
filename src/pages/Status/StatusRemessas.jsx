import React from "react";
import { NavLink, Outlet } from "react-router-dom";

/* [ALTERAÇÃO] Container de Status com abas Pendentes | Finalizados */
export default function StatusRemessas() {
  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-[1400px] w-full mx-auto px-2">


        {/* [ALTERAÇÃO] Abas */}
        <div className="mt-4 flex gap-2 border-b">
          <NavLink
            to="pendentes"
            className={({ isActive }) =>
              `px-3 py-2 text-sm rounded-t-md border ${isActive
                ? "bg-[#4B8C8F] text-white border-[#4B8C8F]"
                : "bg-white border-b-white border-gray-300 font-semibold hover:bg-gray-200"}`
            }
            end
          >
            Pendentes
          </NavLink>

          <NavLink
            to="finalizados"
            className={({ isActive }) =>
              `px-3 py-2 text-sm rounded-t-md border ${isActive
                ? "bg-[#4B8C8F] text-white border-[#4B8C8F]"
                : "bg-white border-b-white border-gray-300 font-semibold hover:bg-gray-200"}`
            }
          >
            Finalizados
          </NavLink>

        </div>

        {/* [ALTERAÇÃO] Aqui renderiza a subpágina selecionada */}
        <div className="bg-white border shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
