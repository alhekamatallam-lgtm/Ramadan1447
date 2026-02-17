
import React, { useState } from 'react';
import { MaintenanceRecord } from '../types';

interface MaintenanceDashboardProps {
  records: MaintenanceRecord[];
  isAdmin: boolean;
  onEdit: (record: MaintenanceRecord) => void;
  onBack: () => void;
  onAddNew: () => void;
}

const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({ records, isAdmin, onEdit, onBack, onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = records.filter(r => 
    r.المسجد?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-3xl font-black text-[#003366]">لوحة تحكم الصيانة</h2>
        </div>
        <button onClick={onAddNew} className="bg-[#003366] text-white px-8 py-4 rounded-2xl font-black">تقرير جديد</button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b border-slate-50">
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-4 py-4">المسجد</th>
                <th className="px-4 py-4">أعمال صيانة</th>
                <th className="px-4 py-4">الحالة</th>
                <th className="px-4 py-4 text-center">الاجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-5 font-bold">{r.المسجد}</td>
                  <td className="px-4 py-5 font-black">{r.أعمال_الصيانة_عدد}</td>
                  <td className="px-4 py-5">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${
                       r.الاعتماد === 'معتمد' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {r.الاعتماد || 'تحت التدقيق'}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <button onClick={() => onEdit(r)} className="text-[#0054A6] text-xs font-black">
                      {isAdmin ? 'اعتماد' : 'تعديل'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
