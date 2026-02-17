
import React, { useState, useEffect } from 'react';
import { MosqueRecord, MosqueInfo, DayInfo } from '../types';
import { INITIAL_RECORD } from '../constants';
import InputGroup from './InputGroup';

const getTodayHijri = () => {
  try {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatter.format(today).replace('هـ', '').trim();
  } catch (e) { return ""; }
};

const getDayNumber = (code: string) => {
  const match = code.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const convertAndCleanNumbers = (val: string) => {
  if (!val) return '';
  const converted = val.toString().replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776));
  return converted.replace(/[^\d]/g, '');
};

interface CustomInputProps {
  label: string;
  name: keyof MosqueRecord;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isNumeric?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, name, value, onChange, isNumeric = false, readOnly = false, placeholder = "٠" }) => (
  <div className="flex flex-col gap-2 group">
    <label className="text-[10px] font-black text-slate-500 group-focus-within:text-[#0054A6] uppercase tracking-widest pr-1 transition-colors">{label}</label>
    <input
      type="text"
      inputMode={isNumeric ? "numeric" : "text"}
      name={name as string}
      value={value ?? ''}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full px-6 py-4 border-2 rounded-2xl outline-none transition-all font-bold shadow-sm ${
        readOnly ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-white border-slate-100 text-[#003366] focus:border-[#0054A6] focus:ring-4 focus:ring-[#0054A6]/5'
      }`}
    />
  </div>
);

const RecordForm: React.FC<any> = ({ initialData, mosques, days, onSave, onCancel }) => {
  const [formData, setFormData] = useState<MosqueRecord>(INITIAL_RECORD);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [selectedMosqueCode, setSelectedMosqueCode] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setSelectedMosqueCode(initialData.mosque_code);
    } else {
      setFormData({ ...INITIAL_RECORD, record_id: `MRJ-${Date.now()}`, تاريخ_هجري: getTodayHijri() });
    }
  }, [initialData]);

  useEffect(() => {
    const mosque = mosques.find(m => m.mosque_code === selectedMosqueCode);
    if (mosque && enteredPassword) {
        setIsPasswordCorrect(String(mosque.pwd).trim() === enteredPassword.trim());
    } else {
        setIsPasswordCorrect(false);
    }
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
    setFormData(prev => ({ 
        ...prev, 
        mosque_code: code, 
        المسجد: mosque?.المسجد || '', 
        "نوع الموقع": mosque?.["نوع الموقع"] || '' 
    }));
    setEnteredPassword('');
  };

  const dayNum = getDayNumber(formData.code_day);
  const isNight1 = dayNum === 1;
  const isFarm = formData["نوع الموقع"] === "مزرعة";
  const showItikaf = dayNum >= 20 && !isFarm;

  // منطق الظهور للأقسام
  const showWorshippers = !isFarm;
  const showIftar = isFarm || (!isNight1);
  const showEducation = !isFarm && !isNight1;
  const showMissionary = !isFarm;
  const showCommunity = !isFarm;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-40">
      {/* القسم 1: الهوية والتحقق */}
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-[#C5A059]"></div>
        <h3 className="text-2xl font-black text-[#003366] mb-8 flex items-center gap-3">
          <span className="w-10 h-10 bg-[#0054A6]/10 rounded-xl flex items-center justify-center text-xl">👤</span>
          بيانات المشرف والتحقق
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المسجد / الموقع</label>
            <select value={selectedMosqueCode} onChange={handleMosqueChange} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#0054A6] font-bold text-[#003366] appearance-none shadow-inner">
              <option value="">اختر المسجد المسجل باسمك...</option>
              {mosques.map(m => <option key={m.mosque_code} value={m.mosque_code}>{m.supervisor_name} - {m.المسجد} ({m["نوع الموقع"]})</option>)}
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
          {/* القسم 2: الوقت واليوم */}
          <InputGroup title="الوقت واليوم" icon="⏰">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ليلة اليوم الرمضاني</label>
              <select name="code_day" value={formData.code_day} onChange={(e) => {
                const day = days.find(d => d.code_day === e.target.value);
                setFormData(prev => ({ ...prev, code_day: e.target.value, label_day: day?.label || '' }));
              }} className="px-6 py-4 border-2 border-slate-100 rounded-2xl bg-white font-bold outline-none focus:border-[#0054A6] shadow-sm">
                <option value="">اختر اليوم...</option>
                {days.map(d => <option key={d.code_day} value={d.code_day}>{d.label}</option>)}
              </select>
            </div>
            <CustomInput label="التاريخ الهجري" name="تاريخ_هجري" value={formData.تاريخ_هجري} onChange={handleChange} readOnly />
          </InputGroup>

          {/* القسم 3: المصلين - لا يظهر في المزارع */}
          {showWorshippers && (
            <div className="animate-in fade-in">
              <InputGroup title="إحصائيات المصلين" icon="🕌">
                <CustomInput label="عدد المصلين (رجال)" name="عدد_المصلين_رجال" value={formData.عدد_المصلين_رجال} onChange={handleChange} isNumeric />
                <CustomInput label="عدد المصلين (نساء)" name="عدد_المصلين_نساء" value={formData.عدد_المصلين_نساء} onChange={handleChange} isNumeric />
              </InputGroup>
            </div>
          )}

          {/* القسم 4: الإفطار والضيافة */}
          {showIftar && (
            <div className="animate-in fade-in">
              <InputGroup title="مشروع الإفطار والضيافة" icon="🍽️">
                <CustomInput label="إفطار مدعوم (وجبات)" name="عدد_وجبات_افطار_المدعومة" value={formData.عدد_وجبات_افطار_المدعومة} onChange={handleChange} isNumeric />
                <CustomInput label="إفطار فعلي (وجبات)" name="عدد_وجبات_الافطار_فعلي" value={formData.عدد_وجبات_الافطار_فعلي} onChange={handleChange} isNumeric />
                <CustomInput label="كراتين الماء الموزعة" name="عدد_كراتين_ماء" value={formData.عدد_كراتين_ماء} onChange={handleChange} isNumeric />
                <CustomInput label="مستفيدي الضيافة" name="عدد_مستفيدي_الضيافة" value={formData.عدد_مستفيدي_الضيافة} onChange={handleChange} isNumeric />
              </InputGroup>
            </div>
          )}

          {/* القسم 5: الحلقات */}
          {showEducation && (
            <div className="animate-in fade-in">
              <InputGroup title="حلقات التحفيظ والمقرأة" icon="📖">
                <CustomInput label="عدد الطلاب (بنين)" name="عدد_طلاب_الحلقات" value={formData.عدد_طلاب_الحلقات} onChange={handleChange} isNumeric />
                <CustomInput label="أوجه الحفظ (بنين)" name="عدد_الاوجه_طلاب" value={formData.عدد_الاوجه_طلاب} onChange={handleChange} isNumeric />
                <CustomInput label="عدد الطالبات (بنات)" name="عدد_طالبات_الحلقات" value={formData.عدد_طالبات_الحلقات} onChange={handleChange} isNumeric />
                <CustomInput label="أوجه الحفظ (بنات)" name="عدد_الاوجه_طالبات" value={formData.عدد_الاوجه_طالبات} onChange={handleChange} isNumeric />
              </InputGroup>
            </div>
          )}

          {/* القسم 6: الاعتكاف */}
          {showItikaf && (
            <div className="relative pt-6 animate-in fade-in">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#C5A059] text-white px-8 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] z-10 shadow-lg">العشر الأواخر</div>
              <InputGroup title="الاعتكاف والسحور" icon="🌙">
                  <CustomInput label="عدد المعتكفين (رجال)" name="عدد_المعتكفين_رجال" value={formData.عدد_المعتكفين_رجال} onChange={handleChange} isNumeric />
                  <CustomInput label="وجبات سحور (رجال)" name="عدد_وجبات_السحور_رجال" value={formData.عدد_وجبات_السحور_رجال} onChange={handleChange} isNumeric />
                  <CustomInput label="عدد المعتكفات (نساء)" name="عدد_المعتكفين_نساء" value={formData.عدد_المعتكفين_نساء} onChange={handleChange} isNumeric />
                  <CustomInput label="وجبات سحور (نساء)" name="عدد_وجبات_السحور_نساء" value={formData.عدد_وجبات_السحور_نساء} onChange={handleChange} isNumeric />
              </InputGroup>
            </div>
          )}

          {/* القسم 7: النشاط الدعوي والميداني */}
          {showMissionary && (
            <div className="animate-in fade-in">
              <InputGroup title="النشاط الدعوي والميداني" icon="🤝">
                <CustomInput label="كلمات وعظية (رجال)" name="عدد_الكلمات_الرجالية" value={formData.عدد_الكلمات_الرجالية} onChange={handleChange} isNumeric />
                <CustomInput label="كلمات وعظية (نساء)" name="عدد_الكلمات_النسائية" value={formData.عدد_الكلمات_النسائية} onChange={handleChange} isNumeric />
                <CustomInput label="مستفيدي الكلمات" name="عدد_مستفيدي_الكلمات" value={formData.عدد_مستفيدي_الكلمات} onChange={handleChange} isNumeric />
                <CustomInput label="عدد المسابقات" name="عدد_المسابقات" value={formData.عدد_المسابقات} onChange={handleChange} isNumeric />
                <CustomInput label="عدد المتطوعين" name="عدد_المتطوعين" value={formData.عدد_المتطوعين} onChange={handleChange} isNumeric />
                <CustomInput label="عدد المشرفين" name="عدد المشرفين" value={formData["عدد المشرفين"]} onChange={handleChange} isNumeric />
                <CustomInput label="أطفال الحضانة" name="عدد_اطفال_الحضانة" value={formData.عدد_اطفال_الحضانة} onChange={handleChange} isNumeric />
              </InputGroup>
            </div>
          )}

          {/* القسم الجديد: البرامج المجتمعية */}
          {showCommunity && (
            <div className="animate-in fade-in">
              <InputGroup title="البرامج والفعاليات المجتمعية" icon="🎨">
                <CustomInput label="اسم البرنامج المجتمعي" name="البرنامج_المجتمعي" value={formData.البرنامج_المجتمعي} onChange={handleChange} placeholder="مثال: مسابقة الطفل الرمضانية" />
                <CustomInput label="عدد المستفيدين" name="عدد_المستفيدين" value={formData.عدد_المستفيدين} onChange={handleChange} isNumeric placeholder="٠" />
                <CustomInput label="وصف البرنامج" name="وصف_البرنامج" value={formData.وصف_البرنامج} onChange={handleChange} placeholder="وصف مختصر للفعالية..." />
              </InputGroup>
            </div>
          )}

          {/* القسم 8: الملاحظات */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
            <label className="text-[11px] font-black text-[#5a7b9c] uppercase tracking-widest mb-4 block">ملاحظات المشرف الميداني</label>
            <textarea name="ملاحظات" value={formData.ملاحظات} onChange={(e:any) => setFormData(p=>({...p, ملاحظات: e.target.value}))} rows={4} className="w-full px-6 py-5 bg-slate-50 rounded-3xl outline-none focus:bg-white border-2 border-transparent focus:border-[#0054A6] font-bold text-[#003366] transition-all" placeholder="أدخل أي ملاحظات أو تحديات واجهتكم اليوم..." />
          </div>

          {/* زر الإرسال العائم */}
          <div className="fixed bottom-10 left-0 right-0 px-4 z-[50] pointer-events-none">
            <button 
                onClick={() => onSave(formData)} 
                className="pointer-events-auto w-full max-w-lg mx-auto bg-[#0054A6] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-3 border-4 border-white active:scale-95 transition-all hover:bg-[#003366]"
            >
              <span className="text-sm">🚀</span>
              ارسل التقرير
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#0054A6]/5 p-12 rounded-[3rem] border-2 border-dashed border-[#0054A6]/20 text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h4 className="text-xl font-bold text-[#003366]">بانتظار التحقق...</h4>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">يرجى اختيار المسجد وإدخال كلمة المرور لفتح نموذج الإحصائيات</p>
        </div>
      )}
    </div>
  );
};

export default RecordForm;
