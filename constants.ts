
import { DayOption, MosqueOption } from './types';

export const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxNQ7dv6Sl-LOkpCoriy9eB9_u4Z56JnAtMH4SiX0TTW6H9BX-yiwWRzULXzw-QQ3jYFA/exec';

export const RAMADAN_DAYS: DayOption[] = Array.from({ length: 30 }, (_, i) => ({
  code: `DAY_${(i + 1).toString().padStart(2, '0')}`,
  label: `اليوم ${(i + 1)} رمضان`,
}));

export const MOSQUES: MosqueOption[] = [
  { code: 'MOSQ_HAFR_ALBATIN', name: 'جامع حفر الباطن' },
  { code: 'MOSQ_AL_RAJHI', name: 'جامع الراجحي' },
  { code: 'MOSQ_AL_KHOZAM', name: 'جامع الخزام' },
  { code: 'MOSQ_BIN_LADIN', name: 'جامع بن لادن' },
  // يمكن إضافة المزيد من المساجد هنا
];

export const INITIAL_RECORD: any = {
  record_id: '',
  created_at: '',
  code_day: '',
  label_day: '',
  mosque_code: '',
  المسجد: '',
  تاريخ_هجري: '',
  عدد_المصلين_رجال: 0,
  عدد_المصلين_نساء: 0,
  عدد_وجبات_افطار: 0,
  عدد_كراتين_ماء: 0,
  عدد_مستفيدي_الضيافة: 0,
  عدد_طلاب_الحلقات: 0,
  عدد_الاوجه_طلاب: 0,
  عدد_طالبات_الحلقات: 0,
  عدد_الاوجه_طالبات: 0,
  عدد_المتطوعين: 0,
  عدد_المسابقات: 0,
  عدد_اطفال_الحضانة: 0,
  عدد_الكلمات_الرجالية: 0,
  عدد_الكلمات_النسائية: 0,
  عدد_مستفيدي_الكلمات: 0,
  عدد_المعتكفين_رجال: 0,
  عدد_المعتكفين_نساء: 0,
  ملاحظات: '',
};
