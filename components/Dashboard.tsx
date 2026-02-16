
import React from 'react';
import { MosqueRecord, MosqueInfo, DayInfo } from '../types';

interface DashboardProps {
  records: MosqueRecord[];
  mosques: MosqueInfo[];
  days: DayInfo[];
  onNavigateToRecords: () => void;
  onNavigateToAdd: () => void;
  onNavigateToMaintenance: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ records, mosques, days, onNavigateToRecords, onNavigateToAdd, onNavigateToMaintenance }) => {
  const totalWorshippers = records.reduce((sum, r) => sum + (Number(r.عدد_المصلين_رجال) || 0) + (Number(r.عدد_المصلين_نساء) || 0), 0);
  const totalIftarMeals = records.reduce((sum, r) => sum + (Number(r.عدد_وجبات_افطار_المدعومة) || 0), 0);
  const totalStudents = records.reduce((sum, r) => sum + (Number(r.عدد_طلاب_الحلقات) || 0) + (Number(r.عدد_طالبات_الحلقات) || 0), 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-[#003366]">مرحباً بك 🌙</h2>
        <p className="text-[#5a7b9c] font-bold">بوابة الميدان لإدارة أنشطة مساجد مؤسسة عبدالله الراجحي الخيرية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button onClick={onNavigateToAdd} className="group bg-[#0054A6] text-white p-10 rounded-[3rem] shadow-2xl shadow-[#0054A6]/30 flex flex-col items-center text-center gap-6 transition-all active:scale-95 border-b-8 border-[#003366]">
          <div className="w-16 h-16 bg-[#C5A059] rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">📝</div>
          <div>
            <h3 className="text-xl font-black">تقرير المسجد الميداني</h3>
            <p className="text-white/70 text-xs mt-2">إحصائيات المصلين، الإفطار والحلقات</p>
          </div>
        </button>

        <button onClick={onNavigateToMaintenance} className="group bg-white text-[#003366] p-10 rounded-[3rem] shadow-xl border-2 border-slate-100 flex flex-col items-center text-center gap-6 transition-all active:scale-95 border-b-8 border-slate-200">
          <div className="w-16 h-16 bg-[#003366]/5 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🛠️</div>
          <div>
            <h3 className="text-xl font-black text-[#003366]">داشبورد الصيانة والنظافة</h3>
            <p className="text-slate-500 text-xs mt-2">متابعة النظافة، الصيانة واللوجستيات</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={onNavigateToRecords} className="md:col-span-3 bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 text-[#003366] font-bold flex items-center justify-center gap-3 hover:bg-white hover:border-[#0054A6]/30 transition-all group">
            <span className="text-xl group-hover:translate-x-2 transition-transform">📊</span>
            عرض سجلات الأنشطة الميدانية السابقة
        </button>
        <StatCard label="إجمالي المصلين" value={totalWorshippers} color="#0054A6" />
        <StatCard label="وجبات الإفطار" value={totalIftarMeals} color="#C5A059" />
        <StatCard label="طلاب الحلقات" value={totalStudents} color="#003366" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-2 h-full" style={{ backgroundColor: color }}></div>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
    <h4 className="text-3xl font-black tabular-nums" style={{ color }}>{value.toLocaleString('ar-SA')}</h4>
  </div>
);

export default Dashboard;
