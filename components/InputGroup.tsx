
import React from 'react';

interface InputGroupProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
        {icon && <span className="text-emerald-600">{icon}</span>}
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
};

export default InputGroup;
