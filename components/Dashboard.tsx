
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

  const StatCard = ({ title, value, icon, gradient, color }: { title: string, value: string | number, icon: React.ReactNode, gradient: string, color: string }) => (
    <div className={`relative overflow-hidden bg-white rounded-[2.5rem] p-5 sm:p-6 shadow-xl shadow-slate-200/40 border border-slate-50 transition-all active:scale-95 group`}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${color} blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
      <div className="flex flex-col gap-4 relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center text-white shadow-lg shadow-inner`}>
          {icon}
        </div>
        <div>
          <p className="text-slate-400 text-[10px] font-black mb-1 uppercase tracking-[0.1em]">{title}</p>
          <h4 className="text-2xl font-black text-slate-800 tracking-tight tabular-nums">{value.toLocaleString('ar-SA')}</h4>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8 pb-32">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-slate-900 leading-none flex items-center gap-2">
            مرحباً بك <span className="animate-bounce">🌙</span>
          </h2>
          <p className="text-slate-400 text-[11px] font-bold mt-2 bg-slate-100 px-3 py-1 rounded-full w-fit uppercase tracking-wider">لوحة المتابعة الميدانية</p>
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onNavigateToAdd}
          className="bg-emerald-600 text-white p-5 rounded-[2.5rem] shadow-xl shadow-emerald-200 flex flex-col items-center gap-3 active:scale-95 transition-all relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity"></div>
          <div className="bg-white/20 p-2.5 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-black text-sm">تقرير جديد</span>
        </button>
        <button 
          onClick={onNavigateToRecords}
          className="bg-white text-slate-700 p-5 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100 flex flex-col items-center gap-3 active:scale-95 transition-all"
        >
          <div className="bg-slate-50 p-2.5 rounded-2xl text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="font-black text-sm">السجلات</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="المصلين" 
          value={totalWorshippers} 
          color="bg-emerald-500"
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-700"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
        />
        <StatCard 
          title="وجبات الإفطار" 
          value={totalIftarMeals} 
          color="bg-amber-500"
          gradient="bg-gradient-to-br from-amber-400 to-orange-600"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {/* أيقونة مطابقة للصورة المرفقة: هلال + طبق مغطى + كأس */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 18h11M2 18a8 8 0 0115 0H2zM10 10a4 4 0 00-4 4h8a4 4 0 00-4-4zM10 10V9a1 1 0 011-1h0a1 1 0 011 1v1M18 18h4v-7l-1-1h-2l-1 1v7zM18 13c0 1 2 1 2 0M7 5a3 3 0 013-3 4 4 0 01-3 3z" />
            </svg>
          }
        />
        <StatCard 
          title="حلقات القرآن" 
          value={totalStudents} 
          color="bg-blue-500"
          gradient="bg-gradient-to-br from-blue-400 to-indigo-700"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="M8 6h10" />
              <path d="M8 10h10" />
            </svg>
          }
        />
        <StatCard 
          title="المتطوعين" 
          value={totalVolunteers} 
          color="bg-rose-500"
          gradient="bg-gradient-to-br from-rose-400 to-rose-700"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {/* أيقونة أيدي مساعدة */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
            </svg>
          }
        />
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/30 border border-slate-50">
        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          المساجد الأكثر عطاءً
        </h3>
        <div className="space-y-4">
          {mosques.slice(0, 4).map((mosque, idx) => {
             const mRecords = records.filter(r => r.mosque_code === mosque.mosque_code);
             const mMeals = mRecords.reduce((s, r) => s + (Number(r.عدد_وجبات_افطار) || 0), 0);
             return (
               <div key={idx} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-white rounded-2xl shadow-sm flex items-center justify-center font-black text-emerald-600 text-sm border border-slate-100">
                      {idx + 1}
                    </div>
                    <div>
                      <h5 className="font-black text-slate-800 text-xs sm:text-sm">{mosque.المسجد}</h5>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">إجمالي الوجبات</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-emerald-700 font-black text-lg leading-none">{mMeals.toLocaleString('ar-SA')}</span>
                    <span className="text-[9px] text-emerald-600/60 font-bold">وجبة</span>
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
