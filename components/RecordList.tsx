
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">سجلات الأنشطة</h1>
          <p className="text-slate-500">استعراض وتعديل بيانات المساجد لشهر رمضان 1447هـ</p>
        </div>
        <button
          onClick={onAddNew}
          className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          إضافة سجل جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="ابحث عن مسجد أو يوم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm font-bold uppercase tracking-wider">
                <th className="px-6 py-4">المسجد</th>
                <th className="px-6 py-4">اليوم</th>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4">مصلين (رجال)</th>
                <th className="px-6 py-4">مصلين (نساء)</th>
                <th className="px-6 py-4">وجبات إفطار</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.record_id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800">{record.المسجد || '---'}</td>
                    <td className="px-6 py-4 text-emerald-700 font-medium">{record.label_day || '---'}</td>
                    <td className="px-6 py-4 text-slate-500">{record.تاريخ_هجري || '---'}</td>
                    <td className="px-6 py-4 text-slate-700">{record.عدد_المصلين_رجال || 0}</td>
                    <td className="px-6 py-4 text-slate-700">{record.عدد_المصلين_نساء || 0}</td>
                    <td className="px-6 py-4 text-slate-700 font-bold">{record.عدد_وجبات_افطار || 0}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onEdit(record)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 font-bold text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        تعديل
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                    لا توجد سجلات مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordList;
