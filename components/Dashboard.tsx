
import React from 'react';
import { MosqueRecord, MosqueInfo, DayInfo } from '../types';

interface DashboardProps {
  records: MosqueRecord[];
  mosques: MosqueInfo[];
  days: DayInfo[];
  onNavigateToRecords: () => void;
  onNavigateToAdd: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ records, mosques, days, onNavigateToRecords, onNavigateToAdd }) => {
  const totalWorshippers = records.reduce((sum, r) => sum + (Number(r.عدد_المصلين_رجال) || 0) + (Number(r.عدد_المصلين_نساء) || 0), 0);
  const totalIftarMeals = records.reduce((sum, r) => sum + (Number(r.عدد_وجبات_افطار) || 0), 0);
  const totalVolunteers = records.reduce((sum, r) => sum + (Number(r.عدد_المتطوعين) || 0), 0);
  const totalStudents = records.reduce((sum, r) => sum + (Number(r.عدد_طلاب_الحلقات) || 0) + (Number(r.عدد_طالبات_الحلقات) || 0), 0);

  const StatCard = ({ title, value, icon, color, gradient }: { title: string, value: string | number, icon: React.ReactNode, color: string, gradient: string }) => (
    <div className={`relative overflow-hidden bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 transition-all active:scale-95 group`}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${color} blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
      <div className="flex flex-col gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* الترحيب المحمول */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌙</span>
          <h2 className="text-2xl font-black text-slate-900 leading-none">مرحباً بك</h2>
        </div>
        <p className="text-slate-500 text-sm font-medium">نظام متابعة إنجاز المساجد اليومي - 1447هـ</p>
      </div>

      {/* أزرار الوصول السريع للجوال */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onNavigateToAdd}
          className="bg-emerald-600 text-white p-5 rounded-[2rem] shadow-lg shadow-emerald-200 flex flex-col items-center gap-3 active:bg-emerald-700 transition-colors"
        >
          <div className="bg-white/20 p-2 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-bold text-sm">إضافة تقرير</span>
        </button>
        <button 
          onClick={onNavigateToRecords}
          className="bg-white text-emerald-700 p-5 rounded-[2rem] shadow-lg shadow-slate-200 border border-emerald-50 flex flex-col items-center gap-3 active:bg-emerald-50 transition-colors"
        >
          <div className="bg-emerald-50 p-2 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="font-bold text-sm">السجلات</span>
        </button>
      </div>

      {/* الإحصائيات الحية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="المصلين" 
          value={totalWorshippers} 
          color="bg-emerald-500"
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard 
          title="الإفطار" 
          value={totalIftarMeals} 
          color="bg-amber-500"
          gradient="bg-gradient-to-br from-amber-400 to-amber-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          title="الحلقات" 
          value={totalStudents} 
          color="bg-blue-500"
          gradient="bg-gradient-to-br from-blue-400 to-blue-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
        <StatCard 
          title="المتطوعين" 
          value={totalVolunteers} 
          color="bg-rose-500"
          gradient="bg-gradient-to-br from-rose-400 to-rose-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
      </div>

      {/* قائمة المساجد المميزة للجوال */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
          أبرز المساجد نشاطاً
        </h3>
        <div className="space-y-4">
          {mosques.slice(0, 3).map((mosque, idx) => {
             const mRecords = records.filter(r => r.mosque_code === mosque.mosque_code);
             const mMeals = mRecords.reduce((s, r) => s + (Number(r.عدد_وجبات_افطار) || 0), 0);
             return (
               <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-emerald-600">
                      {idx + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{mosque.المسجد}</h5>
                      <p className="text-[10px] text-slate-400 font-medium tracking-wide">إجمالي الوجبات الموزعة</p>
                    </div>
                  </div>
                  <div className="text-emerald-700 font-black text-lg">
                    {mMeals}
                  </div>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
