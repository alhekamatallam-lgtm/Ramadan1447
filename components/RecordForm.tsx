
import React, { useState, useEffect } from 'react';
import { MosqueRecord, MosqueInfo, DayInfo } from '../types';
import { INITIAL_RECORD } from '../constants';
import InputGroup from './InputGroup';

const getTodayHijri = () => {
  try {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    return formatter.format(today).replace('هـ', '').trim();
  } catch (e) { return ""; }
};

const convertAndCleanNumbers = (val: string) => {
  if (!val) return '';
  const converted = val.toString().replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776));
  return converted.replace(/[^\d]/g, '');
};

const RecordForm: React.FC<any> = ({ initialData, mosques, days, isAdmin, onSave, onCancel }) => {
  const [formData, setFormData] = useState<MosqueRecord>(INITIAL_RECORD);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [selectedMosqueCode, setSelectedMosqueCode] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setSelectedMosqueCode(initialData.mosque_code);
      if (isAdmin) setIsPasswordCorrect(true);
    } else {
      setFormData({ ...INITIAL_RECORD, record_id: `MRJ-${Date.now()}`, تاريخ_هجري: getTodayHijri() });
    }
  }, [initialData, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const mosque = mosques.find(m => m.mosque_code === selectedMosqueCode);
    // دعم كلمة المرور سواء كانت نص أو رقم من الـ API
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
    if (mosque) {
      setFormData(prev => ({ 
        ...prev, 
        mosque_code: code, 
        المسجد: mosque.المسجد,
        "نوع الموقع": mosque["نوع الموقع"]
      }));
    }
  };

  const isFarm = formData["نوع الموقع"] === "مزرعة";

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-40 animate-in fade-in">
      {!isAdmin && (
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <h3 className="text-xl font-black text-[#003366] mb-8">👤 بيانات المشرف الميداني</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <select value={selectedMosqueCode} onChange={handleMosqueChange} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-[#0054A6]">
              <option value="">اختر المسجد...</option>
              {mosques.map(m => <option key={m.mosque_code} value={m.mosque_code}>{m.المسجد}</option>)}
            </select>
            <input type="password" value={enteredPassword} onChange={(e) => setEnteredPassword(e.target.value)} placeholder="كلمة المرور" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-[#0054A6]" />
          </div>
        </div>
      )}

      {(isPasswordCorrect || isAdmin) && (
        <div className="space-y-8 animate-in fade-in">
          <InputGroup title="الوقت والموقع" icon="⏰">
            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">اليوم / الليلة</label>
               <select name="label_day" value={formData.label_day} onChange={(e) => {
                 const d = days.find(x => x.code_day === e.target.value);
                 // وفقاً للهيكلية في مثالك: code_day يأخذ المسمى العربي و label_day يأخذ الكود الإنجليزي
                 setFormData(p => ({ ...p, label_day: e.target.value, code_day: d?.label || '' }));
               }} className="px-6 py-4 border-2 rounded-2xl bg-white font-bold outline-none focus:border-[#0054A6]">
                 <option value="">اختر من القائمة...</option>
                 {days.map(d => <option key={d.code_day} value={d.code_day}>{d.label}</option>)}
               </select>
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">التاريخ الهجري</label>
               <input type="text" value={formData.تاريخ_هجري} readOnly className="px-6 py-4 bg-slate-50 rounded-2xl text-slate-400 font-bold" />
            </div>
          </InputGroup>

          <InputGroup title="إحصائيات المصلين والإفطار" icon="🕌">
            {!isFarm && <input type="text" inputMode="numeric" name="عدد_المصلين_رجال" value={formData.عدد_المصلين_رجال} onChange={handleChange} placeholder="المصلين رجال" className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#0054A6]" />}
            {!isFarm && <input type="text" inputMode="numeric" name="عدد_المصلين_نساء" value={formData.عدد_المصلين_نساء} onChange={handleChange} placeholder="المصلين نساء" className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#0054A6]" />}
            <input type="text" inputMode="numeric" name="عدد_وجبات_افطار_المدعومة" value={formData.عدد_وجبات_افطار_المدعومة} onChange={handleChange} placeholder="وجبات إفطار مدعومة" className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#0054A6]" />
            <input type="text" inputMode="numeric" name="عدد_وجبات_الافطار_فعلي" value={formData.عدد_وجبات_الافطار_فعلي} onChange={handleChange} placeholder="وجبات إفطار فعلي" className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#0054A6]" />
            <input type="text" inputMode="numeric" name="عدد_كراتين_ماء" value={formData.عدد_كراتين_ماء} onChange={handleChange} placeholder="عدد كراتين الماء" className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#0054A6]" />
          </InputGroup>

          {isAdmin && (
            <div className="bg-[#003366] p-10 rounded-[3rem] shadow-2xl text-white animate-in slide-in-from-bottom">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">🔐</span>
                اعتماد التقرير (للمسؤول)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {['قيد المراجعة', 'معتمد', 'يعاد التقرير'].map(status => (
                   <button 
                     key={status}
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

          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
             <label className="text-[10px] font-black text-slate-400 mb-4 block uppercase tracking-widest">ملاحظات إضافية</label>
             <textarea name="ملاحظات" value={formData.ملاحظات} onChange={handleChange} rows={4} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-[#0054A6] font-bold text-[#003366]" placeholder="اكتب ملاحظاتك هنا..." />
          </div>

          <div className="fixed bottom-10 left-0 right-0 px-4 z-[50]">
            <button onClick={() => onSave({ ...formData, sheet: 'daily_mosque_report' })} className="w-full max-w-lg mx-auto bg-[#0054A6] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
               {isAdmin ? '💾 حفظ التعديلات والاعتماد' : '📤 إرسال التقرير للمراجعة'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordForm;
