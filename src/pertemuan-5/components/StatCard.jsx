import React from 'react';

const StatCard = ({ title, value, icon, color, linkText, onClick }) => {
  const colorClasses = {
    green: {
      border: "border-emerald-500/40",
      bg: "bg-emerald-50/80",
      ring: "ring-emerald-200/70",
      iconBg: "bg-emerald-100",
      btn: "bg-emerald-200 text-emerald-900 hover:bg-emerald-300",
    },
    yellow: {
      border: "border-amber-500/40",
      bg: "bg-amber-50/80",
      ring: "ring-amber-200/70",
      iconBg: "bg-amber-100",
      btn: "bg-amber-200 text-amber-900 hover:bg-amber-300",
    },
    blue: {
      border: "border-blue-500/40",
      bg: "bg-blue-50/80",
      ring: "ring-blue-200/70",
      iconBg: "bg-blue-100",
      btn: "bg-blue-200 text-blue-900 hover:bg-blue-300",
    },
    red: {
      border: "border-rose-500/40",
      bg: "bg-rose-50/80",
      ring: "ring-rose-200/70",
      iconBg: "bg-rose-100",
      btn: "bg-rose-200 text-rose-900 hover:bg-rose-300",
    },
  };



  const c = colorClasses[color] ?? colorClasses.blue;

  return (
    <div
      className={`group relative rounded-2xl border ${c.border} ${c.bg} shadow-sm overflow-hidden flex flex-col items-center p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${c.ring} ring-1/2`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(closest-side,rgba(59,130,246,0.14),transparent)]" />

      <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center ${c.iconBg} border border-black/5`}
      >
        <div className="text-2xl">{icon}</div>
      </div>

      <h3 className="relative z-10 mt-4 text-2xl font-black text-slate-900">{value}</h3>
      <p className="relative z-10 text-sm font-semibold text-slate-600 mb-4 text-center">{title}</p>

      <button
        onClick={onClick}
        className={`relative z-10 w-full py-2 px-4 rounded-xl text-xs font-bold flex justify-between items-center transition-colors ${c.btn}`}
      >
        {linkText} <span className="opacity-90">»</span>
      </button>
    </div>
  );
};

export default StatCard;