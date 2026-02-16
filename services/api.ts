
import { API_ENDPOINT } from '../constants';
import { ApiResponse } from '../types';

export const mosqueApi = {
  async getAll(): Promise<ApiResponse> {
    try {
      // نستخدم التوقيت الحالي لمنع التخزين المؤقت (Cache) وضمان قراءة أحدث البيانات
      const response = await fetch(`${API_ENDPOINT}?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },

  async save(data: any): Promise<{ success: boolean }> {
    try {
      // إرسال البيانات كـ text/plain هو الحل الأمثل لـ Google Apps Script لتجنب مشاكل CORS Preflight
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors', // نستخدم no-cors في حال كان السكريبت لا يدعم CORS بالكامل، ولكن يفضل التحقق من السكريبت
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data),
      });

      // ملاحظة: عند استخدام no-cors لن نتمكن من قراءة الاستجابة، سنفترض النجاح إذا لم يحدث خطأ في الشبكة
      return { success: true };
    } catch (error) {
      // محاولة أخرى بدون no-cors في حال كان السكريبت مهيأ بشكل صحيح
      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return await response.json();
      } catch (innerError) {
        console.error('Error saving record:', innerError);
        throw innerError;
      }
    }
  }
};
