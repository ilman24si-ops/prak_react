import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-[#F1F5F9] text-slate-800 antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-[1400px] mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
