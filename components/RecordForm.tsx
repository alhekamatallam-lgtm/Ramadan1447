
import React, { useState, useEffect } from 'react';
import { MosqueRecord } from '../types';
import { RAMADAN_DAYS, MOSQUES, INITIAL_RECORD } from '../constants';
import InputGroup from './InputGroup';

interface RecordFormProps {
  initialData?: MosqueRecord | null;
  onSave: (data: Partial<MosqueRecord>) => void;
  onCancel: () => void;
}

const RecordForm: React.FC<RecordFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<MosqueRecord>(INITIAL_RECORD);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      // تحويل القيم الفارغة إلى 0 أو نص فارغ لضمان عمل الواجهة بشكل صحيح
      const sanitized = { ...initialData };
      Object.keys(sanitized).forEach(key => {
        const k = key as keyof MosqueRecord;
        if (typeof INITIAL_RECORD[k] === 'number' && (sanitized[k] === '' || sanitized[k] === null)) {
          (sanitized[k] as any) = 0;
        }
      });
      setFormData(sanitized);
    } else {
      setFormData({
        ...INITIAL_RECORD,
        record_id: `MOSQ-1447-${new Date().toISOString().slice(5, 10).replace('-', '-')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        created_at: new Date().toISOString(),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Math.max(0, parseInt(value))) : value
    }));
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDay = RAMADAN_DAYS.find(d => d.code === e.target.value);
    setFormData(prev => ({
      ...prev,
      code_day: e.target.value,
      label_day: selectedDay?.label || '',
      تاريخ_هجري: selectedDay ? `${RAMADAN_DAYS.indexOf(selectedDay) + 1}/09/1447` : ''
    }));
  };

  const handleMosqueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMosque = MOSQUES.find(m => m.code === e.target.value);
    setFormData(prev => ({
      ...prev,
      mosque_code: e.target.value,
      المسجد: selectedMosque?.name || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      // إرسال التغييرات فقط + record_id (Partial Update)
      const diff: Partial<MosqueRecord> = { record_id: formData.record_id };
      Object.keys(formData).forEach(key => {
        const k = key as keyof MosqueRecord;
        if (formData[k] !== initialData?.[k]) {
          (diff[k] as any) = formData[k];
        }
      });
      onSave(diff);
    } else {
      // إرسال السجل كاملاً في حال الإضافة
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
        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
            className="flex-1 sm:flex-none px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-colors"
          >
            {isEditing ? 'تحديث البيانات' : 'حفظ السجل'}
          </button>
        </div>
      </div>

      <InputGroup title="المعلومات الأساسية">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 pr-1">اليوم</label>
          <select
            name="code_day"
            value={formData.code_day}
            onChange={handleDayChange}
            required
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="">اختر اليوم...</option>
            {RAMADAN_DAYS.map(day => (
              <option key={day.code} value={day.code}>{day.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 pr-1">المسجد</label>
          <select
            name="mosque_code"
            value={formData.mosque_code}
            onChange={handleMosqueChange}
            required
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="">اختر المسجد...</option>
            {MOSQUES.map(m => (
              <option key={m.code} value={m.code}>{m.name}</option>
            ))}
          </select>
        </div>

        <InputField label="التاريخ الهجري" name="تاريخ_هجري" type="text" placeholder="DD/MM/YYYY" />
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
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          placeholder="أدخل أي ملاحظات إضافية هنا..."
        />
      </div>
    </form>
  );
};

export default RecordForm;
