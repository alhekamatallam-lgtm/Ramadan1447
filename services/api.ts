
import { API_ENDPOINT } from '../constants';
import { MosqueRecord, ApiResponse } from '../types';

export const mosqueApi = {
  async getAll(): Promise<ApiResponse> {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw new Error('Failed to fetch data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },

  async save(data: Partial<MosqueRecord>): Promise<{ success: boolean }> {
    try {
      // إرسال البيانات كـ POST للباك اند
      // ملاحظة: مع Google Apps Script، أحياناً نحتاج لاستخدام content-type: text/plain لتجاوز الـ CORS preflight
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // استجابة Google Apps Script بعد إعادة التوجيه
      // إذا كان CORS يمنع قراءة النتيجة، نفترض النجاح إذا لم يرمي خطأً (مع no-cors)
      // ولكن هنا نفترض أن الـ Endpoint مهيأ للرد بـ JSON
      if (!response.ok) throw new Error('Failed to save data');
      return await response.json();
    } catch (error) {
      console.error('Error saving record:', error);
      throw error;
    }
  }
};
