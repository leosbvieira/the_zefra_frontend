// src/Layout.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";

const Layout = ({ children }) => {
  const [section, setSection] = useState("Dashboard Ativos");
  const [activeTab, setActiveTab] = useState("Resumo");

  return (
    <div>
      <Sidebar setSection={setSection} />
      <div
        className="fixed top-0 right-0 z-30"
        style={{ left: "60px", height: "64px", background: "white" }}
      >
        <TopNavbar
          section={section}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="ml-[60px] pt-16 p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
