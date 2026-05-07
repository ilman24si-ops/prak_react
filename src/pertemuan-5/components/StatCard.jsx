import React from 'react';

const StatCard = ({ title, value, subtext, icon, color, footerText, linkText }) => {
  const colorClasses = {
    green: 'border-green-500 bg-green-50',
    yellow: 'border-yellow-500 bg-yellow-50',
    blue: 'border-blue-500 bg-blue-50',
    red: 'border-red-500 bg-red-50',
  };

  const btnClasses = {
    green: 'bg-green-200 text-green-800',
    yellow: 'bg-yellow-200 text-yellow-800',
    blue: 'bg-blue-200 text-blue-800',
    red: 'bg-red-200 text-red-800',
  };

  return (
    <div className={`border-t-4 rounded-xl shadow-sm bg-white overflow-hidden flex flex-col items-center p-6 ${colorClasses[color]}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-sm font-medium text-slate-500 mb-4">{title}</p>
      <button className={`w-full py-2 px-4 rounded-md text-xs font-bold flex justify-between items-center ${btnClasses[color]}`}>
        {linkText} <span>»</span>
      </button>
    </div>
  );
};

export default StatCard;