
import React, { useState } from 'react';
import { MosqueRecord } from '../types';

interface RecordListProps {
  records: MosqueRecord[];
  isAdmin: boolean;
  onEdit: (record: MosqueRecord) => void;
  onAddNew: () => void;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'يعتمد': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'مرفوض': return 'bg-red-100 text-red-700 border-red-200';
    case 'معتمد': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'يعاد التقرير': return 'bg-orange-100 text-orange-700 border-orange-200';
    default: return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};

const RecordList: React.FC<RecordListProps> = ({ records, isAdmin, onEdit, onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.المسجد?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.label_day?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-black text-[#003366]">سجلات الأنشطة الميدانية</h1>
             {isAdmin && <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest">وضع المسؤول مفعل 🔐</span>}
          </div>
          <button onClick={onAddNew} className="p-3 bg-[#0054A6] text-white rounded-2xl shadow-lg hover:scale-105 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن مسجد أو يوم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] shadow-sm outline-none focus:border-[#0054A6] transition-all font-bold text-[#003366]"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b border-slate-50">
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-5">المسجد</th>
                <th className="px-6 py-5">اليوم</th>
                <th className="px-6 py-5">المصلين</th>
                <th className="px-6 py-5">الحالة</th>
                <th className="px-6 py-5 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.map((record) => (
                <tr key={record.record_id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-[#003366]">{record.المسجد}</td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-[#0054A6] bg-[#0054A6]/5 px-3 py-1 rounded-full">{record.label_day}</span>
                  </td>
                  <td className="px-6 py-5 font-black text-slate-600">
                    {Number(record.عدد_المصلين_رجال || 0) + Number(record.عدد_المصلين_نساء || 0)}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${getStatusStyle(record.الاعتماد || '')}`}>
                      {record.الاعتماد || 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => onEdit(record)} 
                      className={`text-xs font-black px-4 py-2 rounded-xl transition-all ${
                        isAdmin ? 'bg-[#003366] text-white shadow-md' : 'text-[#0054A6] hover:bg-[#0054A6]/5'
                      }`}
                    >
                      {isAdmin ? 'مراجعة واعتماد' : 'تعديل'}
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

export default RecordList;
