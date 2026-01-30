
import React, { useState, useEffect } from 'react';
import { MosqueRecord, MosqueInfo, DayInfo } from '../types';
import { INITIAL_RECORD } from '../constants';
import InputGroup from './InputGroup';

interface RecordFormProps {
  initialData?: MosqueRecord | null;
  mosques: MosqueInfo[];
  days: DayInfo[];
  existingRecords: MosqueRecord[];
  onSave: (data: Partial<MosqueRecord>) => void;
  onCancel: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ initialData, mosques, days, existingRecords, onSave, onCancel }) => {
  const [formData, setFormData] = useState<MosqueRecord>(INITIAL_RECORD);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  
  const isEditing = !!initialData;

  // تهيئة البيانات عند التعديل
  useEffect(() => {
    if (initialData) {
      const sanitized = { ...initialData };
      Object.keys(sanitized).forEach(key => {
        const k = key as keyof MosqueRecord;
        if (typeof INITIAL_RECORD[k] === 'number' && (sanitized[k] === '' || sanitized[k] === null)) {
          (sanitized[k] as any) = 0;
        }
      });
      setFormData(sanitized);
      const mosque = mosques.find(m => m.mosque_code === initialData.mosque_code);
      if (mosque) {
        setSelectedSupervisorId(mosque.mosque_code);
        // في حالة التعديل، نفترض أن الهوية تم التحقق منها مسبقاً أو نطلبها مجدداً
        // هنا سأجعلها تطلب كلمة المرور دائماً للأمان، إلا إذا أراد العميل غير ذلك
      }
    } else {
      setFormData({
        ...INITIAL_RECORD,
        record_id: `MOSQ-1447-${new Date().toISOString().slice(5, 10).replace('-', '-')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        created_at: new Date().toISOString(),
      });
    }
  }, [initialData, mosques]);

  // التحقق من كلمة المرور بدقة مع إزالة المسافات
  useEffect(() => {
    const currentMosque = mosques.find(m => m.mosque_code === selectedSupervisorId);
    if (currentMosque && enteredPassword) {
      const isValid = String(currentMosque.pwd).trim() === String(enteredPassword).trim();
      setIsPasswordCorrect(isValid);
    } else {
      setIsPasswordCorrect(false);
    }
  }, [enteredPassword, selectedSupervisorId, mosques]);

  const availableDays = !formData.mosque_code ? days : days.filter(d => 
    !existingRecords.some(r => r.mosque_code === formData.mosque_code && r.code_day === d.code_day && r.record_id !== formData.record_id)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Math.max(0, parseInt(value))) : value
    }));
  };

  const handleSupervisorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedSupervisorId(code);
    const mosque = mosques.find(m => m.mosque_code === code);
    setFormData(prev => ({
      ...prev,
      mosque_code: mosque?.mosque_code || '',
      المسجد: mosque?.المسجد || '',
      code_day: '',
      label_day: ''
    }));
    setEnteredPassword('');
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDay = days.find(d => d.code_day === e.target.value);
    setFormData(prev => ({
      ...prev,
      code_day: e.target.value,
      label_day: selectedDay?.label || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordCorrect) return;
    onSave(formData);
  };

  const InputField = ({ label, name, type = 'number' }: { label: string, name: keyof MosqueRecord, type?: string }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] as any}
        onChange={handleChange}
        className="px-5 py-4 border border-slate-100 rounded-[1.2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-black text-slate-700 bg-white shadow-sm hover:border-emerald-200"
        min={type === 'number' ? 0 : undefined}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 pb-40">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">{isEditing ? 'تعديل البيانات' : 'رفع تقرير ميداني'}</h2>
          <p className="text-slate-400 text-[10px] font-black mt-2 bg-slate-100 px-3 py-1 rounded-full w-fit uppercase tracking-widest">رمضان 1447هـ</p>
        </div>
        <button type="button" onClick={onCancel} className="p-3.5 bg-white text-slate-400 rounded-2xl border border-slate-100 shadow-sm active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* الخطوة الأولى: التحقق من الهوية */}
      <div className={`transition-all duration-500 transform ${isPasswordCorrect ? 'scale-95 opacity-50 pointer-events-none mb-4' : 'scale-100 opacity-100 mb-8'}`}>
        <div className="bg-emerald-900 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-emerald-900/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-800 rounded-full blur-3xl opacity-50 transition-all group-hover:scale-110"></div>
          
          {!isPasswordCorrect ? (
            <>
              <h3 className="text-lg font-black mb-6 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-emerald-400/20 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                التحقق من هوية المشرف
              </h3>
              <div className="space-y-4 relative z-10">
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] text-emerald-300 font-bold pr-1">المشرف الميداني</label>
                   <select value={selectedSupervisorId} onChange={handleSupervisorChange} required className="w-full px-5 py-4 bg-emerald-800/60 border border-emerald-700/50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-sm appearance-none transition-all text-white">
                     <option value="" className="text-slate-800">اختر اسمك من القائمة...</option>
                     {mosques.map(m => <option key={m.mosque_code} value={m.mosque_code} className="text-slate-800">{m.supervisor_name} - {m.المسجد}</option>)}
                   </select>
                 </div>
                 
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] text-emerald-300 font-bold pr-1">كلمة المرور</label>
                   <div className="relative">
                     <input 
                       type="password" 
                       value={enteredPassword} 
                       onChange={(e) => setEnteredPassword(e.target.value)} 
                       placeholder="••••••••" 
                       className="w-full px-5 py-4 bg-emerald-800/60 border border-emerald-700/50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-sm tracking-[0.3em] transition-all placeholder:tracking-normal text-white" 
                     />
                   </div>
                   <p className="text-[9px] text-emerald-400/60 font-medium px-1 italic">سيتم فتح نموذج الإدخال تلقائياً عند إدخال كلمة المرور الصحيحة.</p>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 py-2 relative z-10">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-black text-lg">أهلاً بك، {mosques.find(m => m.mosque_code === selectedSupervisorId)?.supervisor_name}</h3>
                <p className="text-emerald-300 text-xs font-medium">تم التحقق بنجاح. يمكنك الآن تعبئة التقرير.</p>
              </div>
              <button 
                type="button" 
                onClick={() => { setIsPasswordCorrect(false); setEnteredPassword(''); }}
                className="mr-auto text-[10px] bg-emerald-800 px-3 py-1.5 rounded-full font-bold hover:bg-emerald-700 transition-colors"
              >
                تغيير المشرف
              </button>
            </div>
          )}
        </div>
      </div>

      {/* الخطوة الثانية: نموذج الإدخال (يظهر فقط عند صحة كلمة المرور) */}
      <div className={`transition-all duration-700 ease-out transform ${isPasswordCorrect ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputGroup 
            title="بيانات الوقت" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            }
          >
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-1">اليوم الميداني</label>
              <select name="code_day" value={formData.code_day} onChange={handleDayChange} required className="px-5 py-4 border border-slate-100 rounded-[1.2rem] bg-white shadow-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10">
                <option value="">اختر اليوم الرمضاني...</option>
                {availableDays.map(d => <option key={d.code_day} value={d.code_day}>{d.label}</option>)}
              </select>
            </div>
            <InputField label="التاريخ الهجري" name="تاريخ_هجري" type="text" />
          </InputGroup>

          <InputGroup 
            title="أعداد المصلين" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            }
          >
            <InputField label="مصلين (رجال)" name="عدد_المصلين_رجال" />
            <InputField label="مصلين (نساء)" name="عدد_المصلين_نساء" />
          </InputGroup>

          <InputGroup 
            title="الإفطار والضيافة" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 18h11M2 18a8 8 0 0115 0H2zM10 10a4 4 0 00-4 4h8a4 4 0 00-4-4zM10 10V9a1 1 0 011-1h0a1 1 0 011 1v1M18 18h4v-7l-1-1h-2l-1 1v7zM18 13c0 1 2 1 2 0M7 5a3 3 0 013-3 4 4 0 01-3 3z" />
              </svg>
            }
          >
            <InputField label="وجبات الإفطار" name="عدد_وجبات_افطار" />
            <InputField label="كراتين مياه" name="عدد_كراتين_ماء" />
            <InputField label="مستفيدي الضيافة" name="عدد_مستفيدي_الضيافة" />
          </InputGroup>

          <InputGroup 
            title="الأنشطة التعليمية" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            }
          >
            <InputField label="طلاب الحلقات" name="عدد_طلاب_الحلقات" />
            <InputField label="أوجه التسميع (بنين)" name="عدد_الاوجه_طلاب" />
            <InputField label="طالبات الحلقات" name="عدد_طالبات_الحلقات" />
            <InputField label="أوجه التسميع (بنات)" name="عدد_الاوجه_طالبات" />
          </InputGroup>

          <InputGroup 
            title="العمل التطوعي" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
              </svg>
            }
          >
            <InputField label="عدد المتطوعين" name="عدد_المتطوعين" />
            <InputField label="المسابقات المنفذة" name="عدد_المسابقات" />
          </InputGroup>

          <div className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/30 border border-slate-50 mb-32">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              ملاحظات ميدانية إضافية
            </label>
            <textarea name="ملاحظات" value={formData.ملاحظات} onChange={handleChange} rows={4} className="w-full px-5 py-5 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-700 bg-slate-50/30" placeholder="سجل هنا أي ملاحظات أو تحديات واجهتكم اليوم..." />
          </div>

          {/* زر الحفظ العائم */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-50">
            <button
              type="submit"
              className="w-full py-5 rounded-[2.2rem] text-white font-black text-lg shadow-2xl shadow-emerald-200 pointer-events-auto transition-all active:scale-90 flex items-center justify-center gap-3 bg-emerald-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span>{isEditing ? 'تحديث البيانات' : 'إرسال التقرير النهائي'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;
