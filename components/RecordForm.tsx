
import React, { useState, useEffect } from 'react';
import { MosqueRecord, MosqueInfo, DayInfo } from '../types';
import { INITIAL_RECORD } from '../constants';
import InputGroup from './InputGroup';

interface RecordFormProps {
  initialData?: MosqueRecord | null;
  mosques: MosqueInfo[];
  days: DayInfo[];
  onSave: (data: Partial<MosqueRecord>) => void;
  onCancel: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ initialData, mosques, days, onSave, onCancel }) => {
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
      
      // في حالة التعديل، نبحث عن المشرف المرتبط بالمسجد
      const mosque = mosques.find(m => m.mosque_code === initialData.mosque_code);
      if (mosque) {
        setSelectedSupervisorId(mosque.mosque_code);
      }
    } else {
      setFormData({
        ...INITIAL_RECORD,
        record_id: `MOSQ-1447-${new Date().toISOString().slice(5, 10).replace('-', '-')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        created_at: new Date().toISOString(),
      });
    }
  }, [initialData, mosques]);

  // التحقق من كلمة المرور عند تغيير المشرف أو الكلمة نفسها
  useEffect(() => {
    const currentMosque = mosques.find(m => m.mosque_code === selectedSupervisorId);
    if (currentMosque && enteredPassword) {
      // مقارنة كلمة المرور (تحويل كلاهما لنص للمقارنة الصحيحة)
      if (String(currentMosque.pwd) === String(enteredPassword)) {
        setIsPasswordCorrect(true);
      } else {
        setIsPasswordCorrect(false);
      }
    } else {
      setIsPasswordCorrect(false);
    }
  }, [enteredPassword, selectedSupervisorId, mosques]);

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
    
    if (mosque) {
      setFormData(prev => ({
        ...prev,
        mosque_code: mosque.mosque_code,
        المسجد: mosque.المسجد
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        mosque_code: '',
        المسجد: ''
      }));
    }
    // إعادة تعيين كلمة المرور عند تغيير المشرف
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

    if (!isPasswordCorrect) {
      alert('عذراً، كلمة المرور غير صحيحة للمشرف المختار');
      return;
    }

    if (isEditing) {
      const diff: Partial<MosqueRecord> = { record_id: formData.record_id };
      Object.keys(formData).forEach(key => {
        const k = key as keyof MosqueRecord;
        if (formData[k] !== initialData?.[k]) {
          (diff[k] as any) = formData[k];
        }
      });
      onSave(diff);
    } else {
      onSave(formData);
    }
  };

  const InputField = ({ label, name, type = 'number', placeholder = '' }: { label: string, name: keyof MosqueRecord, type?: string, placeholder?: string }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-600 pr-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] as any}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={!isPasswordCorrect && name !== 'ملاحظات'}
        className={`px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${!isPasswordCorrect ? 'bg-slate-50 opacity-60 cursor-not-allowed' : 'bg-white'}`}
        min={type === 'number' ? 0 : undefined}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'تعديل سجل نشاط' : 'إضافة سجل نشاط جديد'}</h2>
          <p className="text-slate-500 mt-1">مشروع رمضان 1447هـ - توثيق الأنشطة اليومية</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={!isPasswordCorrect}
            className={`flex-1 sm:flex-none px-8 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all ${isPasswordCorrect ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-400 cursor-not-allowed opacity-70'}`}
          >
            {isEditing ? 'تحديث البيانات' : 'حفظ السجل'}
          </button>
        </div>
      </div>

      {/* قسم صلاحية الوصول */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4 text-emerald-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-bold">صلاحية الوصول والتحقق</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">اختيار المشرف المسجل</label>
            <select
              value={selectedSupervisorId}
              onChange={handleSupervisorChange}
              required
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="">اختر المشرف...</option>
              {mosques.filter(m => m.supervisor_name).map(m => (
                <option key={m.mosque_code} value={m.mosque_code}>
                  {m.supervisor_name} - ({m.المسجد})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${enteredPassword ? (isPasswordCorrect ? 'border-emerald-500 focus:ring-emerald-200 bg-emerald-50' : 'border-red-300 focus:ring-red-100 bg-red-50') : 'border-slate-200 focus:ring-emerald-500'}`}
              />
              {enteredPassword && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {isPasswordCorrect ? (
                    <span className="text-emerald-600 text-xs font-bold">✓ صحيح</span>
                  ) : (
                    <span className="text-red-500 text-xs font-bold">✗ خطأ</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">المسجد المرتبط (تلقائي)</label>
            <input
              type="text"
              value={formData.المسجد}
              readOnly
              className="px-4 py-2 border border-slate-100 bg-slate-100/50 rounded-lg text-slate-500 italic"
              placeholder="سيظهر اسم المسجد هنا..."
            />
          </div>
        </div>
      </div>

      <div className={!isPasswordCorrect ? 'opacity-40 grayscale pointer-events-none' : 'transition-all duration-500'}>
        <InputGroup title="المعلومات الأساسية">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 pr-1">اليوم</label>
            <select
              name="code_day"
              value={formData.code_day}
              onChange={handleDayChange}
              required
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            >
              <option value="">اختر اليوم من القائمة...</option>
              {days.map(day => (
                <option key={day.code_day} value={day.code_day}>{day.label}</option>
              ))}
            </select>
          </div>
          <InputField label="التاريخ الهجري" name="تاريخ_هجري" type="text" placeholder="مثلاً: 01/09/1447" />
        </InputGroup>

        <InputGroup title="أعداد المصلين">
          <InputField label="عدد المصلين (رجال)" name="عدد_المصلين_رجال" />
          <InputField label="عدد المصلين (نساء)" name="عدد_المصلين_نساء" />
        </InputGroup>

        <InputGroup title="الضيافة والإفطار">
          <InputField label="عدد وجبات الإفطار" name="عدد_وجبات_افطار" />
          <InputField label="عدد كراتين الماء" name="عدد_كراتين_ماء" />
          <InputField label="عدد مستفيدي الضيافة" name="عدد_مستفيدي_الضيافة" />
        </InputGroup>

        <InputGroup title="حلقات القرآن">
          <InputField label="عدد طلاب الحلقات" name="عدد_طلاب_الحلقات" />
          <InputField label="عدد الأوجه (طلاب)" name="عدد_الاوجه_طلاب" />
          <InputField label="عدد طالبات الحلقات" name="عدد_طالبات_الحلقات" />
          <InputField label="عدد الأوجه (طالبات)" name="عدد_الاوجه_طالبات" />
        </InputGroup>

        <InputGroup title="الكلمات والمحاضرات">
          <InputField label="الكلمات الرجالية" name="عدد_الكلمات_الرجالية" />
          <InputField label="الكلمات النسائية" name="عدد_الكلمات_النسائية" />
          <InputField label="إجمالي مستفيدي الكلمات" name="عدد_مستفيدي_الكلمات" />
        </InputGroup>

        <InputGroup title="أخرى">
          <InputField label="عدد المتطوعين" name="عدد_المتطوعين" />
          <InputField label="عدد المسابقات" name="عدد_المسابقات" />
          <InputField label="أطفال الحضانة" name="عدد_اطفال_الحضانة" />
          <InputField label="المعتكفين (رجال)" name="عدد_المعتكفين_رجال" />
          <InputField label="المعتكفات (نساء)" name="عدد_المعتكفين_نساء" />
        </InputGroup>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-20">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-50">ملاحظات إضافية</h3>
          <textarea
            name="ملاحظات"
            value={formData.ملاحظات}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
            placeholder="أدخل أي ملاحظات إضافية هنا..."
          />
        </div>
      </div>
    </form>
  );
};

export default RecordForm;
