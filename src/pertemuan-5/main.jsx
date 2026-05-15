import React, { useState, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Dashboard from "./pages/Dashboard";
import PagePlaceholder from "./pages/PagePlaceholder";
import "./tailwind.css";
import "./styles/index.css";

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'Inventory':
        return <PagePlaceholder title="Inventory" icon="📦" />;
      case 'Reports':
        return <PagePlaceholder title="Reports" icon="📈" />;
      case 'Configuration':
        return <PagePlaceholder title="Configuration" icon="⚙️" />;
      case 'Contact Management':
        return <PagePlaceholder title="Contact Management" icon="👥" />;
      case 'Notifications':
        return <PagePlaceholder title="Notifications" icon="🔔" />;
      case 'Chat with Visitors':
        return <PagePlaceholder title="Chat with Visitors" icon="💬" />;
      case 'Application Settings':
        return <PagePlaceholder title="Application Settings" icon="⚙️" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div id="app-container" className="bg-slate-50 min-h-screen flex font-barlow">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div id="main-content" className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

export default App;