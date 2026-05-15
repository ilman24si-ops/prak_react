import React from 'react';
import StatCard from '../components/StatCard';

const Dashboard = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="border-l-4 border-blue-500 pl-4">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
          <p className="text-slate-500 text-sm italic">A quick data overview of the inventory.</p>
        </div>
        <button 
          onClick={() => onNavigate('Reports')}
          className="bg-white border border-slate-200 shadow-sm px-5 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-all"
        >
          Download Report <span className="text-[10px]">▼</span>
        </button>
      </div>

      {/* 4 KOTAK UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="➕" color="green" title="Inventory Status" value="Good" linkText="View Detailed Report" onClick={() => onNavigate('Inventory')} />
        <StatCard icon="💰" color="yellow" title="Revenue : Jan 2022" value="Rs. 8,55,875" linkText="View Detailed Report" onClick={() => onNavigate('Reports')} />
        <StatCard icon="💊" color="blue" title="Medicines Available" value="298" linkText="Visit Inventory" onClick={() => onNavigate('Inventory')} />
        <StatCard icon="⚠️" color="red" title="Medicine Shortage" value="01" linkText="Resolve Now" onClick={() => onNavigate('Notifications')} />
      </div>

      {/* GRID LAPORAN BAWAH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Report */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
            <h4 className="font-bold text-slate-700">Inventory</h4>
            <button className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1">
              Go to Configuration <span>»</span>
            </button>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-white shadow-inner">
              <p className="text-3xl font-black text-slate-800">298</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Total no of Medicines</p>
            </div>
            <div className="border rounded-lg p-4 bg-white shadow-inner">
              <p className="text-3xl font-black text-slate-800">24</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Medicine Groups</p>
            </div>
          </div>
        </div>

        {/* Quick Report */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
            <h4 className="font-bold text-slate-700">Quick Report</h4>
            <button className="text-xs font-bold text-slate-400 flex items-center gap-1">
              January 2022 <span>▼</span>
            </button>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-white shadow-inner">
              <p className="text-3xl font-black text-slate-800">70,856</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Qty of Medicines Sold</p>
            </div>
            <div className="border rounded-lg p-4 bg-white shadow-inner">
              <p className="text-3xl font-black text-slate-800">5,288</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Invoices Generated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;