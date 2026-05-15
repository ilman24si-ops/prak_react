import React from 'react';

const PagePlaceholder = ({ title, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
      <div className="text-6xl mb-6">{icon}</div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">{title} Page</h2>
      <p className="text-slate-500">This feature is currently under development. Please check back later!</p>
    </div>
  );
};

export default PagePlaceholder;
