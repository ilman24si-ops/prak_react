import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menus = [
  { key: 'users', label: 'Kelola User', icon: '👤' },
  { key: 'dokter', label: 'Kelola Dokter', icon: '👨‍⚕️' },
  { key: 'supplier', label: 'Supplier', icon: '🏭' },
  { key: 'pembelian', label: 'Pembelian Stok', icon: '🛒' },
  { key: 'laporan', label: 'Laporan', icon: '📊' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-5 py-6 border-b border-gray-700">
        <h2 className="text-lg font-bold tracking-wide">⚕️ Admin Panel</h2>
        <p className="text-xs text-gray-400 mt-1">Sistem Manajemen Klinik</p>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menus.map((m) => (
            <li key={m.key}>
              <button
                onClick={() => onTabChange(m.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === m.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        <a
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
        >
          ← Kembali ke Dashboard
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
