
import React, { useState, useEffect } from 'react';
import { MaintenanceRecord, MosqueInfo, DayInfo } from '../types';
import { INITIAL_MAINTENANCE_RECORD } from '../constants';
import InputGroup from './InputGroup';

const convertAndCleanNumbers = (val: string) => {
  if (!val) return '';
  const converted = val.toString().replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776));
  return converted.replace(/[^\d]/g, '');
};

const MaintenanceForm: React.FC<any> = ({ initialData, mosques, days, isAdmin, onSave }) => {
  const [formData, setFormData] = useState<MaintenanceRecord>(INITIAL_MAINTENANCE_RECORD);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [selectedMosqueCode, setSelectedMosqueCode] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setSelectedMosqueCode(initialData.mosque_code || '');
      if (isAdmin) setIsPasswordCorrect(true);
    } else {
      setFormData(prev => ({ ...prev, record_id: `MNT-${Date.now()}`, التاريخ: new Date().toISOString() }));
    }
  }, [initialData, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const mosque = mosques.find(m => m.mosque_code === selectedMosqueCode);
    setIsPasswordCorrect(mosque && String(mosque.pwd).trim() === String(enteredPassword).trim());
  }, [enteredPassword, selectedMosqueCode, mosques, isAdmin]);

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
    <div className="max-w-4xl mx-auto space-y-10 pb-40 animate-in fade-in">
      {!isAdmin && (
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#003366]"></div>
          <h3 className="text-2xl font-black text-[#003366] mb-8 flex items-center gap-3">
            <span className="w-10 h-10 bg-[#003366]/10 rounded-xl flex items-center justify-center text-xl">🛠️</span>
            تحقق مشرف الصيانة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الموقع / المسجد</label>
              <select value={selectedMosqueCode} onChange={handleMosqueChange} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#003366] font-bold text-[#003366] appearance-none shadow-inner">
                <option value="">اختر المسجد المراد رفع تقريره...</option>
                {mosques.map(m => <option key={m.mosque_code} value={m.mosque_code}>{m.المسجد}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">كلمة المرور</label>
              <input type="password" value={enteredPassword} onChange={(e) => setEnteredPassword(e.target.value)} placeholder="••••••••" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#003366] font-bold tracking-widest shadow-inner" />
            </div>
          </div>
        </div>
      )}

      {(isPasswordCorrect || isAdmin) && (
        <div className="space-y-8 animate-in fade-in">
          <InputGroup title="اليوم والتاريخ" icon="📅">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">اليوم</label>
              <select name="اليوم" value={formData.اليوم} onChange={handleChange} className="px-6 py-4 border-2 border-slate-100 rounded-2xl bg-white font-bold outline-none focus:border-[#003366]">
                <option value="">اختر اليوم...</option>
                {days.map(d => <option key={d.code_day} value={d.label}>{d.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">التاريخ</label>
              <input type="text" value={new Date(formData.التاريخ).toLocaleDateString('ar-SA')} readOnly className="px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 font-bold text-slate-400" />
            </div>
          </InputGroup>

          <InputGroup title="إحصائيات الصيانة والنظافة" icon="📊">
            <input type="text" inputMode="numeric" name="أعمال_النظافة_عدد" value={formData.أعمال_النظافة_عدد} onChange={handleChange} className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold" placeholder="أعمال النظافة" />
            <input type="text" inputMode="numeric" name="أعمال_الصيانة_عدد" value={formData.أعمال_الصيانة_عدد} onChange={handleChange} className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold" placeholder="أعمال الصيانة" />
            <input type="text" inputMode="numeric" name="عدد_كراتين_الماء_الواقعي" value={formData.عدد_كراتين_الماء_الواقعي} onChange={handleChange} className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold" placeholder="كراتين الماء" />
          </InputGroup>

          {isAdmin && (
            <div className="bg-[#003366] p-10 rounded-[3rem] shadow-2xl text-white">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">🔐</span>
                اعتماد تقرير الصيانة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {['قيد المراجعة', 'معتمد', 'يعاد التقرير'].map(status => (
                   <button 
                     key={status}
                     type="button"
                     onClick={() => setFormData(p => ({ ...p, الاعتماد: status }))}
                     className={`py-4 rounded-2xl font-black transition-all border-2 ${
                       formData.الاعتماد === status ? 'bg-[#C5A059] border-[#C5A059] text-[#003366]' : 'bg-white/5 border-white/20 hover:bg-white/10'
                     }`}
                   >
                     {status}
                   </button>
                 ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <textarea name="أعمال_النظافة_سرد" value={formData.أعمال_النظافة_سرد} onChange={handleChange} rows={3} className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-3xl font-bold" placeholder="تفاصيل أعمال النظافة..." />
            <textarea name="أعمال_الصيانة_سرد" value={formData.أعمال_الصيانة_سرد} onChange={handleChange} rows={3} className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-3xl font-bold" placeholder="تفاصيل أعمال الصيانة..." />
          </div>

          <div className="fixed bottom-10 left-0 right-0 px-4 z-[50]">
            <button 
                type="button"
                onClick={() => onSave({ ...formData, sheet: 'Maintenance_Report' })} 
                className="w-full max-w-lg mx-auto bg-[#003366] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-3 border-4 border-white active:scale-95 transition-all"
            >
              {isAdmin ? '💾 حفظ التعديلات والاعتماد' : '📥 رفع تقرير الصيانة للمراجعة'}
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
