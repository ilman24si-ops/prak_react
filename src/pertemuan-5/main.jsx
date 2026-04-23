import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div id="app-container" className="bg-gray-100 min-h-screen flex font-barlow">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        {/* Sisi Kiri: Sidebar Tetap */}
        <Sidebar />

        {/* Sisi Kanan: Konten Utama */}
        <div id="main-content" className="flex-1 flex flex-col p-4 overflow-y-auto">
          <Header />
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default App;