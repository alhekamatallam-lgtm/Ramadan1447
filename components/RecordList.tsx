
import React, { useState } from 'react';
import { MosqueRecord } from '../types';

interface RecordListProps {
  records: MosqueRecord[];
  onEdit: (record: MosqueRecord) => void;
  onAddNew: () => void;
}

const RecordList: React.FC<RecordListProps> = ({ records, onEdit, onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.المسجد?.includes(searchTerm) || 
    r.label_day?.includes(searchTerm) || 
    r.record_id?.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-slate-800">سجلات الأنشطة</h1>
          <button
            onClick={onAddNew}
            className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg active:scale-95 transition-all"
          >
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
            className="w-full pr-12 pl-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-sm"
          />
          <span className="absolute inset-y-0 right-4 flex items-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* عرض البطاقات للجوال */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {filteredRecords.map((record) => (
          <div key={record.record_id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-slate-800">{record.المسجد}</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{record.label_day}</span>
                  <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full font-bold">{record.تاريخ_هجري}</span>
                </div>
              </div>
              <button 
                onClick={() => onEdit(record)}
                className="p-2 text-emerald-600 bg-emerald-50 rounded-xl active:bg-emerald-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-4">
              <div className="text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">مصلين</p>
                <p className="font-black text-slate-700">{Number(record.عدد_المصلين_رجال) + Number(record.عدد_المصلين_نساء)}</p>
              </div>
              <div className="text-center border-x border-slate-50">
                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">إفطار</p>
                <p className="font-black text-emerald-600">{record.عدد_وجبات_افطار || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">حلقات</p>
                <p className="font-black text-blue-600">{record.عدد_طلاب_الحلقات || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* عرض الجدول للحاسوب */}
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-6 py-5">المسجد</th>
              <th className="px-6 py-5">اليوم</th>
              <th className="px-6 py-5">المصلين</th>
              <th className="px-6 py-5">وجبات إفطار</th>
              <th className="px-6 py-5 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRecords.map((record) => (
              <tr key={record.record_id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-800">{record.المسجد}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{record.label_day}</span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {Number(record.عدد_المصلين_رجال) + Number(record.عدد_المصلين_نساء)}
                </td>
                <td className="px-6 py-4 font-black text-slate-800">{record.عدد_وجبات_افطار || 0}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => onEdit(record)} className="text-emerald-600 font-bold text-xs hover:underline">تعديل</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordList;
