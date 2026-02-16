
import React, { useState, useEffect } from 'react';
import { mosqueApi } from './services/api';
import { MosqueRecord, MaintenanceRecord, PhotoRecord, MosqueInfo, DayInfo } from './types';
import RecordList from './components/RecordList';
import RecordForm from './components/RecordForm';
import MaintenanceForm from './components/MaintenanceForm';
import MaintenanceDashboard from './components/MaintenanceDashboard';
import Dashboard from './components/Dashboard';

type ViewState = 'dashboard' | 'list' | 'form' | 'maintenance' | 'maintenance_list';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [records, setRecords] = useState<MosqueRecord[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [photosList, setPhotosList] = useState<PhotoRecord[]>([]);
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
        setMaintenanceRecords(response.sheets.Maintenance_Report || []);
        setPhotosList(response.sheets.photo || []);
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

  const handleSave = async (data: any) => {
    setLoading(true);
    try {
      await mosqueApi.save(data);
      showNotification('تم المزامنة بنجاح', 'success');
      setView('dashboard');
      setEditingRecord(null);
      await fetchData(); 
    } catch (error) {
      showNotification('فشل في الاتصال بالقاعدة', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-['Tajawal'] text-right" dir="rtl">
      <header className="bg-[#003366] text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-white p-2 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <img src="https://next.rajhifoundation.org/files/52c533df-1.png" alt="شعار الراجحي" className="h-12" />
            </div>
            <div>
              <h1 className="font-black text-xl leading-none">رمضان 1447هـ</h1>
              <p className="text-[10px] text-[#C5A059] uppercase tracking-[0.2em] font-black mt-1">مؤسسة عبدالله بن عبدالعزيز الراجحي الخيرية</p>
            </div>
          </div>
          
          <nav className="flex items-center bg-white/10 rounded-2xl p-1 gap-1 border border-white/5">
            <button onClick={() => setView('dashboard')} className={`px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-[#0054A6] text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>الرئيسية</button>
            <button onClick={() => setView('list')} className={`px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'list' ? 'bg-[#0054A6] text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>السجلات</button>
          </nav>
        </div>
      </header>

      {notification && (
        <div className={`fixed top-28 left-1/2 transform -translate-x-1/2 z-[60] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top ${notification.type === 'success' ? 'bg-[#0054A6] text-white' : 'bg-red-600 text-white'}`}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            {notification.type === 'success' ? '✓' : '!'}
          </div>
          <span className="font-bold">{notification.message}</span>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-xl z-[100] flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute w-32 h-32 bg-[#0054A6]/10 rounded-full animate-ping"></div>
            <div className="relative bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100">
              <img src="https://next.rajhifoundation.org/files/52c533df-1.png" alt="Logo" className="h-16 w-auto" />
            </div>
            <div className="absolute -bottom-4 w-12 h-12 border-4 border-[#C5A059] border-t-[#0054A6] rounded-full animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-[#003366] text-xl font-black">جاري المزامنة</p>
            <p className="text-slate-500 font-bold text-sm animate-pulse tracking-widest">يرجى الانتظار قليلاً...</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in">
        {view === 'dashboard' && (
          <Dashboard 
            records={records} 
            mosques={mosquesList} 
            days={daysList} 
            photos={photosList}
            onNavigateToRecords={() => setView('list')} 
            onNavigateToAdd={() => setView('form')}
            onNavigateToMaintenance={() => setView('maintenance_list')}
          />
        )}
        {view === 'list' && (
          <RecordList 
            records={records} 
            onEdit={(r) => {setEditingRecord(r); setView('form');}} 
            onAddNew={() => {setEditingRecord(null); setView('form');}} 
          />
        )}
        {view === 'form' && (
          <RecordForm 
            initialData={editingRecord} 
            mosques={mosquesList} 
            days={daysList} 
            existingRecords={records} 
            onSave={handleSave} 
            onCancel={() => setView('dashboard')} 
          />
        )}
        {view === 'maintenance' && (
          <MaintenanceForm 
            mosques={mosquesList} 
            days={daysList} 
            onSave={handleSave} 
          />
        )}
        {view === 'maintenance_list' && (
          <MaintenanceDashboard 
            records={maintenanceRecords}
            onBack={() => setView('dashboard')}
            onAddNew={() => setView('maintenance')}
          />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-[#003366] text-white/50 py-3 text-center border-t border-white/5 backdrop-blur-md z-40">
        <p className="text-[10px] font-bold uppercase tracking-widest">جميع الحقوق محفوظة لمؤسسة عبدالله بن عبدالعزيز الراجحي الخيرية © 1447هـ</p>
      </footer>
    </div>
  );
};

export default App;
