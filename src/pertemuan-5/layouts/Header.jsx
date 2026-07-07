import React from 'react';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { session, profile, signOut } = useAuth();

  return (
    <header className="h-20 bg-white border-b px-4 sm:px-8 flex items-center justify-between gap-4">
      <div className="relative w-full sm:w-96">
        <input
          type="text"
          placeholder="Search for anything here..."
          className="w-full bg-slate-100 rounded-lg py-2.5 px-4 text-sm focus:outline-none border border-transparent focus:border-slate-300"
        />
        <span className="absolute right-4 top-2.5 text-slate-400">🔍</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex text-sm font-medium text-slate-600 items-center gap-2 cursor-pointer">
          🌐 English (US) <span className="text-[10px]">▼</span>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-slate-800 font-bold">
            <span className="w-3 h-3 bg-yellow-400 rounded-full" />
            {profile?.full_name ?? session?.user?.email ?? 'Good Morning'}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {session && (
              <button
                type="button"
                onClick={signOut}
                className="text-red-600 hover:text-red-700 font-bold"
              >
                Logout
              </button>
            )}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
