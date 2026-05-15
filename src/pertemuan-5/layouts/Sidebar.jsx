import React from 'react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Inventory', icon: '📦' },
    { name: 'Reports', icon: '📈' },
    { name: 'Configuration', icon: '⚙️' },
    { name: 'Contact Management', icon: '👥' },
    { name: 'Notifications', icon: '🔔', badge: '01' },
    { name: 'Chat with Visitors', icon: '💬' },
  ];

  return (
    <aside className="w-72 bg-[#1E293B] text-slate-300 flex flex-col h-screen sticky top-0">
      {/* BRAND NAME */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-yellow-400 p-2 rounded-lg text-xl">🛒</div>
        <h1 className="text-xl font-bold text-white tracking-tight">Apotek Keluarga 25</h1>
      </div>

      {/* USER PROFILE CARD */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between bg-[#0F172A] p-3 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-500 rounded-lg overflow-hidden border border-green-500">
               <img src="https://ui-avatars.com/api/?name=Subash&background=random" alt="user" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">Subash</p>
              <p className="text-yellow-500 text-[10px] uppercase font-bold italic">Super Admin</p>
            </div>
          </div>
          <span className="text-slate-500 text-xs">⋮</span>
        </div>
      </div>

      {/* NAV MENU */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            onClick={() => onTabChange(item.name)}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${activeTab === item.name ? 'bg-[#00A99D] text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            {item.badge && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{item.badge}</span>}
          </div>
        ))}
        
        <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Settings</div>
        <div 
          onClick={() => onTabChange('Application Settings')}
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer text-sm font-medium ${activeTab === 'Application Settings' ? 'bg-[#00A99D] text-white shadow-lg' : ''}`}
        >
          <span>⚙️</span> Application Settings
        </div>
      </nav>

      <div className="p-4 text-[10px] text-slate-500 border-t border-slate-800 bg-[#1E293B]">
        Powered by Subash © 2022 v 1.1.2
      </div>
    </aside>
  );
};

export default Sidebar;