
import React, { useState, useEffect } from 'react';
import { mosqueApi } from './services/api';
import { MosqueRecord, MosqueInfo, DayInfo } from './types';
import RecordList from './components/RecordList';
import RecordForm from './components/RecordForm';
import Dashboard from './components/Dashboard';

type ViewState = 'dashboard' | 'list' | 'form';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [records, setRecords] = useState<MosqueRecord[]>([]);
  const [mosquesList, setMosquesList] = useState<MosqueInfo[]>([]);
  const [daysList, setDaysList] = useState<DayInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<MosqueRecord | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await mosqueApi.getAll();
      if (response && response.success && response.sheets) {
        setRecords(response.sheets.daily_mosque_report || []);
        setMosquesList(response.sheets.mosque || []);
        setDaysList(response.sheets.Dayd || []);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      showNotification('خطأ في تحميل البيانات', 'error');
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
      showNotification('حدث خطأ أثناء الحفظ', 'error');
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
    <div className="min-h-screen bg-[#f1f5f9] pb-20 font-['Tajawal']">
      <header className="bg-emerald-900 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-700/50 p-2 rounded-xl border border-emerald-600/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">مشروع رمضان 1447هـ</h1>
              <p className="text-[10px] text-emerald-300 uppercase tracking-widest opacity-80">نظام إدارة أنشطة المساجد</p>
            </div>
          </div>
          
          <nav className="flex items-center bg-white/5 rounded-full px-2 py-1 border border-white/10">
            <button 
              onClick={() => setView('dashboard')} 
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-white text-emerald-900 shadow-lg' : 'text-white/70 hover:text-white'}`}
            >
              الرئيسية
            </button>
            <button 
              onClick={() => setView('list')} 
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${view === 'list' ? 'bg-white text-emerald-900 shadow-lg' : 'text-white/70 hover:text-white'}`}
            >
              السجلات
            </button>
            <button 
              onClick={handleAddNew} 
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${view === 'form' && !editingRecord ? 'bg-white text-emerald-900 shadow-lg' : 'text-white/70 hover:text-white'}`}
            >
              إضافة
            </button>
          </nav>
        </div>
      </header>

      {notification && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300
          ${notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          <div className="p-1 bg-white/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-bold text-sm">{notification.message}</span>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[55] flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-[10px] font-bold text-emerald-800 animate-pulse">1447</span>
            </div>
          </div>
          <p className="mt-6 text-emerald-900 font-bold bg-white/80 px-6 py-2 rounded-full shadow-sm">جاري مزامنة البيانات...</p>
        </div>
      )}

      <main className="animate-in fade-in zoom-in-95 duration-500">
        {view === 'dashboard' && (
          <Dashboard 
            records={records} 
            mosques={mosquesList} 
            days={daysList}
            onNavigateToRecords={() => setView('list')}
            onNavigateToAdd={() => handleAddNew()}
          />
        )}
        {view === 'list' && (
          <RecordList 
            records={records} 
            onEdit={handleEdit} 
            onAddNew={handleAddNew} 
          />
        )}
        {view === 'form' && (
          <RecordForm 
            initialData={editingRecord} 
            mosques={mosquesList}
            days={daysList}
            existingRecords={records}
            onSave={handleSave} 
            onCancel={() => { setView('list'); setEditingRecord(null); }} 
          />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 py-3 text-center">
        <div className="flex justify-center items-center gap-2 text-slate-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          نظام التوثيق الميداني - رمضان 1447هـ
        </div>
      </footer>
    </div>
  );
};

export default App;
