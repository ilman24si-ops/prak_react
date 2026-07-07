import React from 'react';
import { useAuth } from '@/context/AuthContext';

const ADMIN_OPERATIONS = [
  { name: 'Dashboard', icon: '📊' },
  { name: 'Inventory', icon: '📦' },
  { name: 'Point of Sales', icon: '🛒' },
  { name: 'Products', icon: '💊' },
  { name: 'Customers', icon: '👥' },
  { name: 'Orders', icon: '🧾' },
  { name: 'User Management', icon: '👤' },
  { name: 'Kelola Dokter', icon: '👨‍⚕️' },
  { name: 'Supplier', icon: '🏭' },
  { name: 'Pembelian Stok', icon: '🧺' },
  { name: 'Laporan Admin', icon: '📈' },
];

const ADMIN_SERVICE = [
  { name: 'Chatbox', icon: '💬' },
];

const ADMIN_MARKETING = [
  { name: 'Broadcast Promo', icon: '📢' },
  { name: 'Artikel Kesehatan', icon: '📰' },
  { name: 'Testimoni', icon: '⭐' },
];

const MEMBER_MENU = [
  { name: 'Member Dashboard', icon: '⭐', section: null },
  { name: 'Keranjang Obat', icon: '🛍️', section: 'Service Automation' },
  { name: 'Upload Resep', icon: '📤', section: 'Service Automation' },
  { name: 'Riwayat Resep Obat', icon: '📋', section: 'Service Automation' },
  { name: 'Chatbox', icon: '💬', section: 'Service Automation' },
  { name: 'Products', icon: '💊', section: null },
  { name: 'My Orders', icon: '🧾', section: null },
  { name: 'Broadcast Promo', icon: '📢', section: 'Marketing Automation' },
  { name: 'Artikel Kesehatan', icon: '📰', section: 'Marketing Automation' },
  { name: 'Testimoni', icon: '💬', section: 'Marketing Automation' },
];

function MenuSection({ title, items, activeTab, onTabChange }) {
  if (!items.length) return null;
  return (
    <>
      {title && (
        <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
          {title}
        </div>
      )}
      {items.map((item) => (
        <div
          key={item.name}
          onClick={() => onTabChange?.(item.name)}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
            activeTab === item.name
              ? 'bg-[#00A99D] text-white shadow-lg'
              : 'hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </div>
        </div>
      ))}
    </>
  );
}

const GUEST_MENU = [
  { name: 'Guest Dashboard', icon: '👤' },
  { name: 'Products', icon: '💊' },
  { name: 'Artikel Kesehatan', icon: '📰' },
  { name: 'Testimoni', icon: '⭐' },
];

const Sidebar = ({ activeTab, onTabChange }) => {
  const { profile, session, isAdmin, isMember, isGuest } = useAuth();

  const displayName = profile?.full_name ?? session?.user?.email ?? 'User';
  const roleLabel = profile?.role ?? 'Guest';
  const avatarName = encodeURIComponent(displayName);

  let lastSection = null;

  return (
    <aside className="w-72 bg-[#1E293B] text-slate-300 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-yellow-400 p-2 rounded-lg text-xl">🛒</div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Apotek Keluarga 25
        </h1>
      </div>

      <div className="px-4 mb-6">
        <div className="flex items-center justify-between bg-[#0F172A] p-3 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-500 rounded-lg overflow-hidden border border-green-500">
              <img
                src={`https://ui-avatars.com/api/?name=${avatarName}&background=random`}
                alt="user"
              />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight truncate max-w-[140px]">
                {displayName}
              </p>
              <p className="text-yellow-500 text-[10px] uppercase font-bold italic">
                {roleLabel}
                {isMember && profile?.tier ? ` · ${profile.tier}` : ''}
              </p>
            </div>
          </div>
          <span className="text-slate-500 text-xs">⋮</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {isAdmin && (
          <>
            <MenuSection
              title="Operations / Sales"
              items={ADMIN_OPERATIONS}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
            <MenuSection
              title="Service Automation"
              items={ADMIN_SERVICE}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
            <MenuSection
              title="Marketing Automation"
              items={ADMIN_MARKETING}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
            <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
              Settings
            </div>
            <div
              onClick={() => onTabChange?.('Application Settings')}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer text-sm font-medium ${
                activeTab === 'Application Settings'
                  ? 'bg-[#00A99D] text-white shadow-lg'
                  : ''
              }`}
            >
              <span>⚙️</span> Application Settings
            </div>
          </>
        )}

        {isGuest && (
          <>
            <MenuSection
              title="Menu"
              items={GUEST_MENU}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          </>
        )}

        {isMember && MEMBER_MENU.map((item) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          return (
            <React.Fragment key={item.name}>
              {showSection && (
                <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                  {item.section}
                </div>
              )}
              <div
                onClick={() => onTabChange?.(item.name)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  activeTab === item.name
                    ? 'bg-[#00A99D] text-white shadow-lg'
                    : 'hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="p-4 text-[10px] text-slate-500 border-t border-slate-800 bg-[#1E293B]">
        Powered by Subash © 2022 v 1.1.2
      </div>
    </aside>
  );
};

export default Sidebar;
