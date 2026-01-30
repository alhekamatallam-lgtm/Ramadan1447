
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
      if (mosque) setSelectedSupervisorId(mosque.mosque_code);
    } else {
      setFormData({
        ...INITIAL_RECORD,
        record_id: `MOSQ-1447-${new Date().toISOString().slice(5, 10).replace('-', '-')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        created_at: new Date().toISOString(),
      });
    }
  }, [initialData, mosques]);

  useEffect(() => {
    const currentMosque = mosques.find(m => m.mosque_code === selectedSupervisorId);
    if (currentMosque && enteredPassword) {
      setIsPasswordCorrect(String(currentMosque.pwd) === String(enteredPassword));
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
    if (isEditing) {
      const diff: Partial<MosqueRecord> = { record_id: formData.record_id };
      Object.keys(formData).forEach(key => {
        const k = key as keyof MosqueRecord;
        if (formData[k] !== initialData?.[k]) (diff[k] as any) = formData[k];
      });
      onSave(diff);
    } else {
      onSave(formData);
    }
  };

  const InputField = ({ label, name, type = 'number' }: { label: string, name: keyof MosqueRecord, type?: string }) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-wider pr-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] as any}
        onChange={handleChange}
        disabled={!isPasswordCorrect && name !== 'ملاحظات'}
        className={`px-4 py-3.5 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold ${!isPasswordCorrect ? 'bg-slate-50 opacity-50 cursor-not-allowed' : 'bg-white shadow-sm hover:border-emerald-200'}`}
        min={type === 'number' ? 0 : undefined}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto py-6 px-4 pb-32">
      {/* رأس النموذج */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{isEditing ? 'تعديل السجل' : 'تقرير جديد'}</h2>
          <p className="text-slate-400 text-xs font-bold mt-1">مشروع رمضان 1447هـ</p>
        </div>
        <button type="button" onClick={onCancel} className="p-3 bg-white text-slate-400 rounded-2xl border border-slate-100 shadow-sm active:bg-slate-50">
           إلغاء
        </button>
      </div>

      {/* التحقق من الهوية */}
      <div className="bg-emerald-900 rounded-[2.5rem] p-6 mb-8 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-emerald-800 rounded-full blur-2xl"></div>
        <h3 className="text-lg font-black mb-6 flex items-center gap-3 relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          التحقق من الصلاحية
        </h3>
        <div className="space-y-4 relative z-10">
           <select value={selectedSupervisorId} onChange={handleSupervisorChange} required className="w-full px-5 py-4 bg-emerald-800/50 border border-emerald-700/50 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-sm appearance-none">
             <option value="">اختر المشرف الميداني...</option>
             {mosques.map(m => <option key={m.mosque_code} value={m.mosque_code}>{m.supervisor_name} - {m.المسجد}</option>)}
           </select>
           <div className="relative">
             <input type="password" value={enteredPassword} onChange={(e) => setEnteredPassword(e.target.value)} placeholder="كلمة المرور" className={`w-full px-5 py-4 bg-emerald-800/50 border border-emerald-700/50 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-sm tracking-widest ${isPasswordCorrect ? 'ring-2 ring-emerald-400' : ''}`} />
             {isPasswordCorrect && <span className="absolute left-4 inset-y-0 flex items-center text-emerald-400 font-black">✓</span>}
           </div>
        </div>
      </div>

      <div className={!isPasswordCorrect ? 'opacity-30 grayscale pointer-events-none' : 'transition-all duration-500'}>
        <InputGroup title="المعلومات الأساسية" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider pr-1">اليوم الرمضاني</label>
            <select name="code_day" value={formData.code_day} onChange={handleDayChange} required className="px-4 py-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option value="">اختر اليوم...</option>
              {availableDays.map(d => <option key={d.code_day} value={d.code_day}>{d.label}</option>)}
            </select>
          </div>
          <InputField label="التاريخ الهجري" name="تاريخ_هجري" type="text" />
        </InputGroup>

        <InputGroup title="أعداد المصلين" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z" /></svg>}>
          <InputField label="مصلين (رجال)" name="عدد_المصلين_رجال" />
          <InputField label="مصلين (نساء)" name="عدد_المصلين_نساء" />
        </InputGroup>

        <InputGroup title="الضيافة والإفطار" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>}>
          <InputField label="وجبات الإفطار" name="عدد_وجبات_افطار" />
          <InputField label="كراتين الماء" name="عدد_كراتين_ماء" />
          <InputField label="مستفيدي الضيافة" name="عدد_مستفيدي_الضيافة" />
        </InputGroup>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-20">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 block">ملاحظات المشرف</label>
          <textarea name="ملاحظات" value={formData.ملاحظات} onChange={handleChange} rows={3} className="w-full px-4 py-4 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium" placeholder="اكتب أي ملاحظات هنا..." />
        </div>
      </div>

      {/* زر الحفظ العائم للجوال */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none">
        <button
          onClick={handleSubmit}
          disabled={!isPasswordCorrect}
          className={`w-full py-5 rounded-[2rem] text-white font-black text-lg shadow-2xl pointer-events-auto transition-all active:scale-95 ${isPasswordCorrect ? 'bg-emerald-600 shadow-emerald-200' : 'bg-slate-300 opacity-50 cursor-not-allowed'}`}
        >
          {isEditing ? 'تحديث البيانات' : 'حفظ التقرير'}
        </button>
      </div>
    </form>
  );
};

export default RecordForm;
