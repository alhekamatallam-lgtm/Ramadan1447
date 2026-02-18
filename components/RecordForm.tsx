
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    setIsPasswordCorrect(mosque && String(mosque.pwd).trim() === String(enteredPassword).trim());
  }, [enteredPassword, selectedMosqueCode, mosques, isAdmin]);

  const handleChange = (e: any) => {
    const { name, value, inputMode } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: inputMode === 'numeric' ? convertAndCleanNumbers(value) : value 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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

  const handleFormSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.label_day || formData.label_day === "") {
      newErrors.label_day = 'يجب اختيار اليوم أو الليلة (حقل إلزامي)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onSave({ ...formData, sheet: 'daily_mosque_report' });
  };

  const isFarm = formData["نوع الموقع"] === "مزرعة";

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-40 animate-in fade-in text-right">
      {!isAdmin && (
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <h3 className="text-xl font-black text-[#003366] mb-8">👤 بيانات المشرف الميداني</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">المسجد</label>
               <select value={selectedMosqueCode} onChange={handleMosqueChange} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-[#0054A6] shadow-inner">
                 <option value="">اختر المسجد...</option>
                 {mosques.map(m => <option key={m.mosque_code} value={m.mosque_code}>{m.المسجد}</option>)}
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">كلمة المرور</label>
               <input type="password" value={enteredPassword} onChange={(e) => setEnteredPassword(e.target.value)} placeholder="••••••••" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:border-[#0054A6] shadow-inner" />
            </div>
          </div>
        </div>
      )}

      {(isPasswordCorrect || isAdmin) && (
        <div className="space-y-8 animate-in fade-in">
          <InputGroup title="الوقت والموقع" icon="⏰">
            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest flex items-center gap-1">
                 اليوم / الليلة <span className="text-red-500 font-black">*</span>
               </label>
               <select 
                 name="label_day" 
                 value={formData.code_day} // نستخدم الكود كقيمة للمنسدلة
                 onChange={(e) => {
                   const selectedCode = e.target.value;
                   const d = days.find(x => x.code_day === selectedCode);
                   // نقوم بحفظ الاسم العربي في label_day والكود في code_day
                   setFormData(p => ({ 
                     ...p, 
                     label_day: d?.label || '', 
                     code_day: selectedCode 
                   }));
                   if (errors.label_day) setErrors(prev => ({ ...prev, label_day: '' }));
                 }} 
                 className={`px-6 py-4 border-2 rounded-2xl bg-white font-bold outline-none transition-all appearance-none ${errors.label_day ? 'border-red-500 bg-red-50/30' : 'focus:border-[#0054A6]'}`}
               >
                 <option value="">اختر من القائمة...</option>
                 {days.map(d => <option key={d.code_day} value={d.code_day}>{d.label}</option>)}
               </select>
               {errors.label_day && <span className="text-red-600 text-[10px] font-black mr-2 animate-pulse">⚠️ {errors.label_day}</span>}
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">التاريخ الهجري</label>
               <input type="text" value={formData.تاريخ_هجري} readOnly className="px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-400 font-bold" />
            </div>
          </InputGroup>

          <InputGroup title="إحصائيات المصلين والإفطار" icon="🕌">
            {!isFarm && 
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">المصلين رجال</label>
                <input type="text" inputMode="numeric" name="عدد_المصلين_رجال" value={formData.عدد_المصلين_رجال} onChange={handleChange} placeholder="أدخل العدد" className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#0054A6]" />
              </div>
            }
            {!isFarm && 
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">المصلين نساء</label>
                <input type="text" inputMode="numeric" name="عدد_المصلين_نساء" value={formData.عدد_المصلين_نساء} onChange={handleChange} placeholder="أدخل العدد" className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#0054A6]" />
              </div>
            }
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">وجبات إفطار مدعومة</label>
              <input type="text" inputMode="numeric" name="عدد_وجبات_افطار_المدعومة" value={formData.عدد_وجبات_افطار_المدعومة} onChange={handleChange} placeholder="أدخل العدد" className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#0054A6]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">وجبات إفطار فعلي</label>
              <input type="text" inputMode="numeric" name="عدد_وجبات_الافطار_فعلي" value={formData.عدد_وجبات_الافطار_فعلي} onChange={handleChange} placeholder="أدخل العدد" className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#0054A6]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">عدد كراتين الماء</label>
              <input type="text" inputMode="numeric" name="عدد_كراتين_ماء" value={formData.عدد_كراتين_ماء} onChange={handleChange} placeholder="أدخل العدد" className="px-6 py-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#0054A6]" />
            </div>
          </InputGroup>

          {isAdmin && (
            <div className="bg-[#003366] p-10 rounded-[3rem] shadow-2xl text-white animate-in slide-in-from-bottom border-b-8 border-[#C5A059]">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">🔐</span>
                اعتماد التقرير الميداني
              </h3>
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-widest mr-2">تغيير حالة الاعتماد</label>
                <div className="relative">
                  <select 
                    value={formData.الاعتماد || 'قيد المراجعة'} 
                    onChange={(e) => setFormData(p => ({ ...p, الاعتماد: e.target.value }))}
                    className={`w-full px-8 py-5 rounded-2xl font-black outline-none border-2 transition-all appearance-none cursor-pointer ${
                      formData.الاعتماد === 'يعتمد' ? 'bg-emerald-500 border-emerald-400 text-white' : 
                      formData.الاعتماد === 'مرفوض' ? 'bg-red-500 border-red-400 text-white' : 
                      'bg-white/10 border-white/20 text-white'
                    }`}
                  >
                    <option value="قيد المراجعة" className="text-slate-800">قيد المراجعة</option>
                    <option value="يعتمد" className="text-slate-800">يعتمد ✅</option>
                    <option value="مرفوض" className="text-slate-800">مرفوض ❌</option>
                  </select>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
             <label className="text-[10px] font-black text-slate-400 mb-4 block uppercase tracking-widest">ملاحظات إضافية</label>
             <textarea name="ملاحظات" value={formData.ملاحظات} onChange={handleChange} rows={4} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-[#0054A6] font-bold text-[#003366]" placeholder="اكتب ملاحظاتك هنا..." />
          </div>

          <div className="fixed bottom-10 left-0 right-0 px-4 z-[50]">
            <button 
              type="button"
              onClick={handleFormSubmit} 
              className="w-full max-w-lg mx-auto bg-[#0054A6] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all border-b-4 border-[#003366]"
            >
               {isAdmin ? '💾 حفظ التعديلات والاعتماد النهائي' : '📤 إرسال التقرير للمراجعة'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordForm;
