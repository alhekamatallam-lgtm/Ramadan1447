
import React from 'react';

interface InputGroupProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 mb-6 overflow-hidden relative">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-50">
        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {children}
      </div>
    </div>
  );
};

export default InputGroup;
