import React from 'react';

const StatCard = ({ title, value, subtext, icon, color, footerText, linkText, onClick }) => {
  const colorClasses = {
    green: 'border-green-500 bg-green-50',
    yellow: 'border-yellow-500 bg-yellow-50',
    blue: 'border-blue-500 bg-blue-50',
    red: 'border-red-500 bg-red-50',
  };

  const btnClasses = {
    green: 'bg-green-200 text-green-800 hover:bg-green-300',
    yellow: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300',
    blue: 'bg-blue-200 text-blue-800 hover:bg-blue-300',
    red: 'bg-red-200 text-red-800 hover:bg-red-300',
  };

  return (
    <div className={`border-t-4 rounded-xl shadow-sm bg-white overflow-hidden flex flex-col items-center p-6 transition-all hover:shadow-md ${colorClasses[color]}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-sm font-medium text-slate-500 mb-4">{title}</p>
      <button 
        onClick={onClick}
        className={`w-full py-2 px-4 rounded-md text-xs font-bold flex justify-between items-center transition-colors ${btnClasses[color]}`}
      >
        {linkText} <span>»</span>
      </button>
    </div>
  );
};

export default StatCard;