
import React, { useState, useEffect } from 'react';
import { MaintenanceRecord, MosqueInfo, DayInfo } from '../types';
import { INITIAL_MAINTENANCE_RECORD } from '../constants';
import InputGroup from './InputGroup';

const convertAndCleanNumbers = (val: string) => {
  if (!val) return '';
  const converted = val.toString().replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776));
  return converted.replace(/[^\d]/g, '');
};

const MaintenanceForm: React.FC<any> = ({ mosques, days, onSave }) => {
  const [formData, setFormData] = useState<MaintenanceRecord>(INITIAL_MAINTENANCE_RECORD);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [selectedMosqueCode, setSelectedMosqueCode] = useState('');

  useEffect(() => {
    setFormData(prev => ({ ...prev, record_id: `MNT-${Date.now()}`, التاريخ: new Date().toISOString() }));
  }, []);

  useEffect(() => {
    const mosque = mosques.find(m => m.mosque_code === selectedMosqueCode);
    setIsPasswordCorrect(mosque && String(mosque.pwd).trim() === enteredPassword.trim());
  }, [enteredPassword, selectedMosqueCode, mosques]);

  const handleChange = (e: any) => {
    const { name, value, inputMode } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: inputMode === 'numeric' ? convertAndCleanNumbers(value) : value 
    }));
  };

  const handleMosqueChange = (e: any) => {
    const code = e.target.value;
    setSelectedMosqueCode(code);
    const mosque = mosques.find(m => m.mosque_code === code);
    setFormData(prev => ({ ...prev, mosque_code: code, المسجد: mosque?.المسجد || '' }));
    setEnteredPassword('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-40">
      {/* قسم الهوية */}
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-[#0054A6]"></div>
        <h3 className="text-2xl font-black text-[#003366] mb-8 flex items-center gap-3">
          <span className="w-10 h-10 bg-[#0054A6]/10 rounded-xl flex items-center justify-center text-xl">🛠️</span>
          تحقق مشرف الصيانة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الموقع / المسجد</label>
            <select value={selectedMosqueCode} onChange={handleMosqueChange} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#0054A6] font-bold text-[#003366] appearance-none shadow-inner">
              <option value="">اختر المسجد المراد رفع تقريره...</option>
              {mosques.map(m => <option key={m.mosque_code} value={m.mosque_code}>{m.supervisor_name} - {m.المسجد}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">كلمة المرور</label>
            <input type="password" value={enteredPassword} onChange={(e) => setEnteredPassword(e.target.value)} placeholder="••••••••" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#0054A6] font-bold tracking-widest shadow-inner" />
          </div>
        </div>
      </div>

      {isPasswordCorrect ? (
        <div className="space-y-8 animate-in fade-in">
          {/* القسم 1: التوقيت */}
          <InputGroup title="اليوم والتاريخ" icon="📅">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">اليوم</label>
              <select name="اليوم" value={formData.اليوم} onChange={handleChange} className="px-6 py-4 border-2 border-slate-100 rounded-2xl bg-white font-bold outline-none focus:border-[#0054A6]">
                <option value="">اختر اليوم...</option>
                {days.map(d => <option key={d.code_day} value={d.label}>{d.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">التاريخ</label>
              <input type="text" value={new Date(formData.التاريخ).toLocaleDateString('ar-SA')} readOnly className="px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 font-bold text-slate-400" />
            </div>
          </InputGroup>

          {/* القسم 2: إحصائيات الأعمال */}
          <InputGroup title="إحصائيات الصيانة والنظافة" icon="📊">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">أعمال النظافة (عدد)</label>
              <input type="text" inputMode="numeric" name="أعمال_النظافة_عدد" value={formData.أعمال_النظافة_عدد} onChange={handleChange} className="px-6 py-4 border-2 border-slate-100 rounded-2xl bg-white font-bold outline-none focus:border-[#0054A6]" placeholder="٠" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">أعمال الصيانة (عدد)</label>
              <input type="text" inputMode="numeric" name="أعمال_الصيانة_عدد" value={formData.أعمال_الصيانة_عدد} onChange={handleChange} className="px-6 py-4 border-2 border-slate-100 rounded-2xl bg-white font-bold outline-none focus:border-[#0054A6]" placeholder="٠" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">كراتين الماء (الواقعي)</label>
              <input type="text" inputMode="numeric" name="عدد_كراتين_الماء_الواقعي" value={formData.عدد_كراتين_الماء_الواقعي} onChange={handleChange} className="px-6 py-4 border-2 border-slate-100 rounded-2xl bg-white font-bold outline-none focus:border-[#0054A6]" placeholder="٠" />
            </div>
          </InputGroup>

          {/* القسم 3: المبادرات واللوجستيات */}
          <InputGroup title="المبادرات والخدمات اللوجستية" icon="🚚">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">المبادرات المقدمة</label>
              <input type="text" name="المبادرات_المقدمة" value={formData.المبادرات_المقدمة} onChange={handleChange} className="px-6 py-4 border-2 border-slate-100 rounded-2xl bg-white font-bold outline-none focus:border-[#0054A6]" placeholder="وصف المبادرة إن وجد..." />
            </div>
            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الخدمات اللوجستية</label>
              <input type="text" name="الخدمات_اللوجستية" value={formData.الخدمات_اللوجستية} onChange={handleChange} className="px-6 py-4 border-2 border-slate-100 rounded-2xl bg-white font-bold outline-none focus:border-[#0054A6]" placeholder="توفير عمالة، تنسيق..." />
            </div>
          </InputGroup>

          {/* القسم 4: السرد التفصيلي */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
                <label className="text-[11px] font-black text-[#5a7b9c] uppercase tracking-widest mb-4 block">تفاصيل أعمال النظافة</label>
                <textarea name="أعمال_النظافة_سرد" value={formData.أعمال_النظافة_سرد} onChange={handleChange} rows={3} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-[#0054A6] font-bold text-[#003366]" placeholder="مثال: تنظيف السجاد، المرافق..." />
            </div>
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
                <label className="text-[11px] font-black text-[#5a7b9c] uppercase tracking-widest mb-4 block">تفاصيل أعمال الصيانة</label>
                <textarea name="أعمال_الصيانة_سرد" value={formData.أعمال_الصيانة_سرد} onChange={handleChange} rows={3} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-[#0054A6] font-bold text-[#003366]" placeholder="مثال: إصلاح الإنارة، السباكة..." />
            </div>
          </div>

          {/* القسم 5: الملاحظات العامة */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
            <label className="text-[11px] font-black text-[#5a7b9c] uppercase tracking-widest mb-4 block">ملاحظات، مشكلات، ومقترحات</label>
            <textarea name="ملاحظات_ومشكلات_ومقترحات" value={formData.ملاحظات_ومشكلات_ومقترحات} onChange={handleChange} rows={4} className="w-full px-6 py-5 bg-slate-50 rounded-3xl outline-none focus:bg-white border-2 border-transparent focus:border-[#0054A6] font-bold text-[#003366] transition-all" placeholder="اكتب أي تحديات أو مقترحات هنا..." />
          </div>

          {/* زر الإرسال العائم */}
          <div className="fixed bottom-10 left-0 right-0 px-4 z-[50] pointer-events-none">
            <button 
                onClick={() => onSave({ ...formData, sheet_name: 'Maintenance_Report' })} 
                className="pointer-events-auto w-full max-w-lg mx-auto bg-[#003366] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-3 border-4 border-white active:scale-95 transition-all hover:bg-[#0054A6]"
            >
              <span className="text-sm">📥</span>
              رفع تقرير الصيانة
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#003366]/5 p-12 rounded-[3rem] border-2 border-dashed border-[#003366]/20 text-center space-y-4">
            <div className="text-4xl">🔑</div>
            <h4 className="text-xl font-bold text-[#003366]">بانتظار التحقق...</h4>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">يرجى اختيار المسجد وإدخال كلمة المرور الموحدة لفتح تقرير الصيانة</p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceForm;
