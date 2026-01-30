
import React, { useState, useEffect } from 'react';
import { mosqueApi } from './services/api';
import { MosqueRecord } from './types';
import RecordList from './components/RecordList';
import RecordForm from './components/RecordForm';

type ViewState = 'list' | 'form';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [records, setRecords] = useState<MosqueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<MosqueRecord | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await mosqueApi.getAll();
      if (response.success) {
        setRecords(response.data);
      }
    } catch (error) {
      showNotification('خطأ في تحميل البيانات، يرجى المحاولة لاحقاً', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (data: Partial<MosqueRecord>) => {
    setLoading(true);
    try {
      // إرسال البيانات للباك اند
      // ملاحظة: قد تواجه CORS في المتصفح مع Google Apps Script، ولكننا نفترض أنها مهيأة كما في الوصف
      await mosqueApi.save(data);
      
      showNotification(editingRecord ? 'تم تحديث البيانات بنجاح' : 'تم إضافة السجل بنجاح', 'success');
      setView('list');
      setEditingRecord(null);
      await fetchRecords(); // تحديث القائمة
    } catch (error) {
      showNotification('حدث خطأ أثناء محاولة الحفظ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: MosqueRecord) => {
    setEditingRecord(record);
    setView('form');
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setView('form');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="font-bold text-xl tracking-tight">إدارة مساجد رمضان 1447هـ</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setView('list')} className={`hover:text-emerald-200 transition-colors ${view === 'list' ? 'border-b-2 border-white' : ''}`}>القائمة الرئيسية</button>
            <button onClick={handleAddNew} className={`hover:text-emerald-200 transition-colors ${view === 'form' && !editingRecord ? 'border-b-2 border-white' : ''}`}>إدخال جديد</button>
          </nav>
        </div>
      </header>

      {/* Notifications */}
      {notification && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce
          ${notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {notification.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-bold">{notification.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-800 font-bold text-lg">جاري معالجة البيانات...</p>
        </div>
      )}

      {/* Main Content */}
      <main>
        {view === 'list' ? (
          <RecordList 
            records={records} 
            onEdit={handleEdit} 
            onAddNew={handleAddNew} 
          />
        ) : (
          <RecordForm 
            initialData={editingRecord} 
            onSave={handleSave} 
            onCancel={() => { setView('list'); setEditingRecord(null); }} 
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 text-center text-slate-400 text-sm">
        مشروع رمضان المبارك 1447هـ - جميع الحقوق محفوظة
      </footer>
    </div>
  );
};

export default App;
