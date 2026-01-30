
export interface MosqueRecord {
  record_id: string;
  created_at: string;
  code_day: string;
  label_day: string;
  mosque_code: string;
  المسجد: string;
  تاريخ_هجري: string;
  عدد_المصلين_رجال: number | string;
  عدد_المصلين_نساء: number | string;
  عدد_وجبات_افطار: number | string;
  عدد_كراتين_ماء: number | string;
  عدد_مستفيدي_الضيافة: number | string;
  عدد_طلاب_الحلقات: number | string;
  عدد_الاوجه_طلاب: number | string;
  عدد_طالبات_الحلقات: number | string;
  عدد_الاوجه_طالبات: number | string;
  عدد_المتطوعين: number | string;
  عدد_المسابقات: number | string;
  عدد_اطفال_الحضانة: number | string;
  عدد_الكلمات_الرجالية: number | string;
  عدد_الكلمات_النسائية: number | string;
  عدد_مستفيدي_الكلمات: number | string;
  عدد_المعتكفين_رجال: number | string;
  عدد_المعتكفين_نساء: number | string;
  ملاحظات: string;
}

export interface ApiResponse {
  success: boolean;
  count: number;
  data: MosqueRecord[];
}

export interface DayOption {
  code: string;
  label: string;
}

export interface MosqueOption {
  code: string;
  name: string;
}
