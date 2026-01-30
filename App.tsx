
import React, { useState, useEffect } from 'react';
import { mosqueApi } from './services/api';
import { MosqueRecord, MosqueInfo, DayInfo } from './types';
import RecordList from './components/RecordList';
import RecordForm from './components/RecordForm';

type ViewState = 'list' | 'form';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [records, setRecords] = useState<MosqueRecord[]>([]);
  const [mosquesList, setMosquesList] = useState<MosqueInfo[]>([]);
  const [daysList, setDaysList] = useState<DayInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<MosqueRecord | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching data from API...');
      const response = await mosqueApi.getAll();
      console.log('API Response:', response);
      
      if (response && response.success && response.sheets) {
        setRecords(response.sheets.daily_mosque_report || []);
        setMosquesList(response.sheets.mosque || []);
        setDaysList(response.sheets.Dayd || []);
      } else {
        throw new Error('Invalid data structure from API');
      }
    } catch (error) {
      console.error('Data loading error:', error);
      showNotification('خطأ في تحميل البيانات من السيرفر، تأكد من إعدادات الـ API', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (data: Partial<MosqueRecord>) => {
    setLoading(true);
    try {
      await mosqueApi.save(data);
      showNotification(editingRecord ? 'تم تحديث البيانات بنجاح' : 'تم إضافة السجل بنجاح', 'success');
      setView('list');
      setEditingRecord(null);
      await fetchData(); 
    } catch (error) {
      showNotification('حدث خطأ أثناء محاولة الحفظ، يرجى التحقق من الاتصال', 'error');
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
      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="font-bold text-lg sm:text-xl tracking-tight">إدارة مساجد رمضان 1447هـ</h1>
          </div>
          
          <nav className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setView('list')} className={`text-sm sm:text-base hover:text-emerald-200 transition-colors ${view === 'list' ? 'border-b-2 border-white' : ''}`}>الرئيسية</button>
            <button onClick={handleAddNew} className={`text-sm sm:text-base hover:text-emerald-200 transition-colors ${view === 'form' && !editingRecord ? 'border-b-2 border-white' : ''}`}>إضافة</button>
          </nav>
        </div>
      </header>

      {notification && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce
          ${notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          <span className="font-bold">{notification.message}</span>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[55] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-800 font-bold">جاري تحميل البيانات...</p>
        </div>
      )}

      <main className="animate-in fade-in duration-500">
        {view === 'list' ? (
          <RecordList 
            records={records} 
            onEdit={handleEdit} 
            onAddNew={handleAddNew} 
          />
        ) : (
          <RecordForm 
            initialData={editingRecord} 
            mosques={mosquesList}
            days={daysList}
            onSave={handleSave} 
            onCancel={() => { setView('list'); setEditingRecord(null); }} 
          />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 text-center text-slate-400 text-xs">
        نظام إدارة الأنشطة الرمضانية 1447هـ - توثيق المساجد
      </footer>
    </div>
  );
};

export default App;
