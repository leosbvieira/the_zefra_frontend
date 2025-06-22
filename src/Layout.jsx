// src/Layout.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";

const Layout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "ml-60" : "ml-20"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;


