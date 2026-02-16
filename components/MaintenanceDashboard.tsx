
import React, { useState } from 'react';
import { MaintenanceRecord } from '../types';

interface MaintenanceDashboardProps {
  records: MaintenanceRecord[];
  onBack: () => void;
  onAddNew: () => void;
}

const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({ records, onBack, onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const totalCleaning = records.reduce((sum, r) => sum + (Number(r.أعمال_النظافة_عدد) || 0), 0);
  const totalMaintenance = records.reduce((sum, r) => sum + (Number(r.أعمال_الصيانة_عدد) || 0), 0);
  const totalWater = records.reduce((sum, r) => sum + (Number(r.عدد_كراتين_الماء_الواقعي) || 0), 0);

  const filtered = records.filter(r => 
    r.المسجد?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.اليوم?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 text-[#003366] hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-3xl font-black text-[#003366]">لوحة تحكم الصيانة</h2>
            <p className="text-[#5a7b9c] font-bold">متابعة النظافة والخدمات اللوجستية 🛠️</p>
          </div>
        </div>
        <button onClick={onAddNew} className="bg-[#003366] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-[#003366]/20 flex items-center gap-2 hover:scale-105 transition-all active:scale-95">
          <span>+</span>
          تقرير صيانة جديد
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#0054A6]"></div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">إجمالي أعمال النظافة</p>
          <h4 className="text-4xl font-black text-[#0054A6]">{totalCleaning.toLocaleString('ar-SA')}</h4>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#C5A059]"></div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">إجمالي أعمال الصيانة</p>
          <h4 className="text-4xl font-black text-[#C5A059]">{totalMaintenance.toLocaleString('ar-SA')}</h4>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#003366]"></div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">كراتين الماء (الواقعي)</p>
          <h4 className="text-4xl font-black text-[#003366]">{totalWater.toLocaleString('ar-SA')}</h4>
        </div>
      </div>

      {/* Search & List */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث باسم المسجد أو اليوم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl shadow-inner outline-none focus:bg-white focus:border-[#0054A6] transition-all font-bold text-[#003366]"
          />
          <span className="absolute inset-y-0 right-4 flex items-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-4 py-4">المسجد</th>
                <th className="px-4 py-4">اليوم</th>
                <th className="px-4 py-4">أعمال نظافة</th>
                <th className="px-4 py-4">أعمال صيانة</th>
                <th className="px-4 py-4">كراتين الماء</th>
                <th className="px-4 py-4">المبادرات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((record, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-5 font-bold text-[#003366]">{record.المسجد}</td>
                  <td className="px-4 py-5"><span className="bg-[#0054A6]/10 text-[#0054A6] px-3 py-1 rounded-full text-xs font-black">{record.اليوم}</span></td>
                  <td className="px-4 py-5 font-black text-slate-600">{record.أعمال_النظافة_عدد}</td>
                  <td className="px-4 py-5 font-black text-slate-600">{record.أعمال_الصيانة_عدد}</td>
                  <td className="px-4 py-5 font-black text-[#003366]">{record.عدد_كراتين_الماء_الواقعي}</td>
                  <td className="px-4 py-5 text-xs font-bold text-slate-400">{record.المبادرات_المقدمة || '-'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 font-bold">لا توجد سجلات مطابقة للبحث</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
