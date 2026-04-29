import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged
} from 'firebase/auth';

// ==========================================
// 1. Firebase 設定 
// ==========================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Icon Components ---
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconUtensils = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
const IconChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const IconChevronUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;
const IconChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const IconPlus = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconSun = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const IconClock = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconSchool = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>;
const IconBriefcase = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IconPlane = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3-3-1c-.5-.2-1-.1-1.4.3l-.3.3c-.3.3-.3.8-.1 1.1L7 20l4.7 4.7c.3.2.8.2 1.1-.1l.3-.3c.4-.4.5-.9.3-1.4l-1-3 3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1Z"/></svg>;
const IconMedical = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><path d="M12 8v8"/><path d="M8 12h8"/></svg>;
const IconTrophy = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const IconMessage = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconCheck = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>;
const IconCopy = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;

const STATUS_OPTIONS = [
  { id: 'no_dinner', label: '夕食不要', Icon: IconUtensils, color: 'bg-red-50', dinner: false, iconProps: { className: "text-red-500" } },
  { id: 'day_off', label: '休み', Icon: IconSun, color: 'bg-orange-50', dinner: true, iconProps: { className: "text-orange-500" } },
  { id: 'school', label: '学校', Icon: IconSchool, color: 'bg-blue-50', dinner: true, hasDetail: 'periods' },
  { id: 'work', label: '仕事', Icon: IconBriefcase, color: 'bg-indigo-50', dinner: true, hasDetail: 'work_type' },
  { id: 'baito', label: 'バイト', Icon: IconBriefcase, color: 'bg-yellow-50', dinner: true, hasDetail: 'time_range' },
  { id: 'club', label: '部活', Icon: IconTrophy, color: 'bg-green-50', dinner: true },
  { id: 'early', label: '早帰り', Icon: IconClock, color: 'bg-orange-50', dinner: true, hasDetail: 'time_single' },
  { id: 'travel', label: '旅行', Icon: IconPlane, color: 'bg-emerald-50', dinner: true },
  { id: 'play', label: '遊び', Icon: IconClock, color: 'bg-purple-50', dinner: true, hasDetail: 'time_range' },
  { id: 'hospital', label: '病院', Icon: IconMedical, color: 'bg-pink-50', dinner: true, hasDetail: 'time_range' },
  { id: 'comment', label: 'メモ', Icon: IconMessage, color: 'bg-slate-50', dinner: true, hasDetail: 'text' },
];

const DEFAULT_MEMBERS = [
  { id: '0', name: 'パパ' },
  { id: '1', name: 'ママ' },
  { id: '2', name: '長男' },
  { id: '3', name: '次男' },
  { id: '4', name: '長女' }
];

// --- Helpers ---
const calculateEndTime = (startTime) => {
  if (!startTime) return "";
  const [h, m] = startTime.split(':').map(Number);
  const endH = (h + 2) % 24;
  return `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// --- Sub-component for handling local inputs (IME Fix) ---
const DetailInput = ({ initialValue, onSave, placeholder, type = "text", onFocus, defaultTime }) => {
  const [localValue, setLocalValue] = useState(initialValue || "");
  
  useEffect(() => { setLocalValue(initialValue || ""); }, [initialValue]);
  
  const handleBlur = () => { if (localValue !== initialValue) onSave(localValue); };
  const handleKeyDown = (e) => { if (e.key === 'Enter') e.target.blur(); };
  
  // 入力欄を触った瞬間に、空ならdefaultTimeをセットするハック
  const handleInteraction = (e) => {
    if (type === 'time' && !localValue && defaultTime) {
      const dt = typeof defaultTime === 'function' ? defaultTime() : defaultTime;
      setLocalValue(dt);
      onSave(dt);
    }
    if (onFocus && e.type === 'focus') onFocus(e);
  };

  return (
    <input 
      type={type} 
      className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-400"
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onFocus={handleInteraction}
      onClick={handleInteraction}
    />
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState({}); // 祝日データ用ステート
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [memberModal, setMemberModal] = useState({ isOpen: false, type: 'add', id: null, name: '' });
  
  const [loading, setLoading] = useState(true);

  // 祝日データの取得 (コンポーネントマウント時)
  useEffect(() => {
    fetch('https://holidays-jp.github.io/api/v1/date.json')
      .then(res => res.json())
      .then(data => setHolidays(data))
      .catch(err => console.error("祝日データの取得に失敗しました", err));
  }, []);

  // Auth: 匿名ログイン
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) { console.error("Auth error:", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Firestore Sync: 実運用向け
  useEffect(() => {
    if (!user) return;
    
    const membersRef = doc(db, 'config', 'members_list');
    const unsubMembers = onSnapshot(membersRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        let loadedMembers = Array.isArray(data.members) ? data.members : DEFAULT_MEMBERS;
        
        // マイグレーション: 古い文字列配列データだった場合、オブジェクト配列(ID付き)に変換する
        if (loadedMembers.length > 0 && typeof loadedMembers[0] === 'string') {
          loadedMembers = loadedMembers.map((name, idx) => ({ id: String(idx), name }));
          setDoc(membersRef, { members: loadedMembers }, { merge: true }).catch(e => console.error(e));
        }
        setMembers(loadedMembers);
      } else {
        setMembers(DEFAULT_MEMBERS);
        setDoc(membersRef, { members: DEFAULT_MEMBERS }).catch(e => console.error(e));
      }
    });

    const schedulesRef = collection(db, 'schedules');
    const unsubSchedules = onSnapshot(schedulesRef, (querySnapshot) => {
      const data = {};
      querySnapshot.forEach((doc) => { data[doc.id] = doc.data(); });
      setSchedules(data);
      setLoading(false);
    }, (err) => setLoading(false));

    return () => { unsubMembers(); unsubSchedules(); };
  }, [user]);

  const dateList = useMemo(() => {
    const list = [];
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      list.push(d);
    }
    return list;
  }, [currentDate]);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const toggleStatus = async (statusId) => {
    if (!selectedCell || !user) return;
    const { dateStr, memberId } = selectedCell;
    const currentDayData = schedules[dateStr] || {};
    let items = currentDayData[memberId] || [];
    const exists = items.find(i => (typeof i === 'string' ? i : i.id) === statusId);
    let newItems;

    if (exists) {
      newItems = items.filter(i => (typeof i === 'string' ? i : i.id) !== statusId);
    } else {
      newItems = [...items, { id: statusId, detail: "" }];
    }

    const newDayData = { ...currentDayData, [memberId]: newItems };
    try { await setDoc(doc(db, 'schedules', dateStr), newDayData); } catch (err) { console.error(err); }
  };

  const updateDetail = async (statusId, detail) => {
    if (!selectedCell || !user) return;
    const { dateStr, memberId } = selectedCell;
    const currentDayData = schedules[dateStr] || {};
    let items = currentDayData[memberId] || [];
    const newItems = items.map(item => {
      const itemId = typeof item === 'string' ? item : item.id;
      if (itemId === statusId) return { id: itemId, detail };
      return item;
    });
    const newDayData = { ...currentDayData, [memberId]: newItems };
    try { await setDoc(doc(db, 'schedules', dateStr), newDayData); } catch (err) { console.error(err); }
  };

  const getDinnerCount = (dateStr) => {
    const dayData = schedules[dateStr] || {};
    let count = 0;
    members.forEach((member) => {
      const items = dayData[member.id] || [];
      const hasNoDinner = items.some(item => {
        const id = typeof item === 'string' ? item : item.id;
        const opt = STATUS_OPTIONS.find(o => o.id === id);
        return opt && opt.dinner === false;
      });
      if (!hasNoDinner) count++;
    });
    return count;
  };

  const copyToNextWeek = async () => {
    const batchPromises = [];
    for (let i = 0; i < 7; i++) {
      const sourceDateStr = formatDate(dateList[i]);
      const targetDateStr = formatDate(dateList[i + 7]);
      
      const sourceData = schedules[sourceDateStr] || {};
      const docRef = doc(db, 'schedules', targetDateStr);
      batchPromises.push(setDoc(docRef, sourceData));
    }

    try {
      await Promise.all(batchPromises);
      setIsCopyModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("コピー中にエラーが発生しました。");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-sans tracking-tight">初期化中...</div>;

  return (
    // 画面全体を固定し、内部のテーブルだけスクロールさせるレイアウト
    <div className="h-[100dvh] bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
      {/* 常に上部に固定されるヘッダー */}
      <header className="shrink-0 bg-white border-b border-slate-200 px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between shadow-sm z-40 relative">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="text-indigo-600 scale-90 sm:scale-100"><IconCalendar /></div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">Family Plan</h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 text-slate-600">
          <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors"><IconChevronLeft /></button>
          <span className="font-bold text-xs sm:text-sm tracking-tighter sm:tracking-tight">{dateList[0].toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}〜</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors"><IconChevronRight /></button>
          
          <div className="w-px h-5 bg-slate-200 mx-1 sm:mx-2 hidden sm:block"></div>
          <button onClick={() => setIsCopyModalOpen(true)} className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-indigo-50 text-indigo-600 rounded-full transition-colors font-bold text-[10px] sm:text-xs" title="1週目の予定を2週目にコピー">
            <IconCopy /> <span className="hidden md:inline">次週へコピー</span>
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 sm:p-2 hover:bg-indigo-50 text-indigo-600 rounded-full transition-colors" title="メンバー設定">
            <IconSettings />
          </button>
        </div>
      </header>

      {/* スクロール可能なメインエリア */}
      <main className="flex-1 overflow-hidden p-1 sm:p-4 max-w-[1400px] mx-auto w-full flex flex-col">
        <div className="bg-white rounded-xl sm:rounded-3xl shadow-sm border border-slate-300 flex-1 overflow-auto custom-scrollbar relative">
          {/* テーブルの最小幅をさらに狭め、スマホで4人分見えるように調整 */}
          <table className="w-full border-collapse min-w-[360px] sm:min-w-[700px] table-fixed">
            <thead className="sticky top-0 z-30 shadow-sm">
              <tr>
                {/* 左上固定セル (日付列のヘッダー) 兼「今週」ボタン */}
                <th className="sticky top-0 left-0 z-40 bg-slate-100 p-0 border-b-2 border-slate-400 border-r border-slate-300 w-10 sm:w-16 align-middle shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] bg-clip-padding">
                  <button 
                    onClick={() => setCurrentDate(new Date())}
                    className="w-full h-full min-h-[48px] flex flex-col items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer px-0.5"
                    title="今週に戻る"
                  >
                    <span className="text-[9px] sm:text-xs font-bold text-slate-600 leading-tight">日付</span>
                    <span className="text-[7px] sm:text-[9px] font-black text-indigo-600 mt-0.5 bg-indigo-100/50 px-1 py-0.5 rounded border border-indigo-200 truncate w-full">今週へ</span>
                  </button>
                </th>
                {/* メンバー列のヘッダー */}
                {members.map((member) => (
                  <th key={`h-${member.id}`} className="sticky top-0 z-30 bg-slate-50 p-1 sm:p-2 text-center text-[10px] sm:text-xs font-bold text-slate-600 border-b-2 border-slate-400 border-r border-slate-200 last:border-r-0 overflow-hidden bg-clip-padding">
                    <div className="flex flex-col items-center gap-0.5">
                      <IconUser />
                      <span className="truncate w-full block">{member.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dateList.map((date) => {
                const dateStr = formatDate(date);
                const isToday = dateStr === formatDate(new Date());
                const dayOfWeek = date.getDay();
                const holidayName = holidays[dateStr];
                const isHoliday = !!holidayName;
                const isSunday = dayOfWeek === 0;
                const isSaturday = dayOfWeek === 6;
                const isRedDay = isSunday || isHoliday; // 日曜または祝日
                const dinnerCount = getDinnerCount(dateStr);
                
                let rowBgClass = 'hover:bg-slate-50/50';
                if (isToday) rowBgClass = 'bg-indigo-50/30';
                else if (isRedDay) rowBgClass = 'bg-red-50/20';
                else if (isSaturday) rowBgClass = 'bg-blue-50/20';

                let dateCellBg = 'bg-white';
                let dateTextClass = 'text-slate-700';
                let dayTextClass = 'text-slate-400';
                if (isToday) {
                  dateCellBg = 'bg-indigo-50';
                  dateTextClass = 'text-indigo-700';
                  dayTextClass = 'text-indigo-400';
                } else if (isRedDay) {
                  dateCellBg = 'bg-red-50';
                  dateTextClass = 'text-red-700';
                  dayTextClass = 'text-red-400';
                } else if (isSaturday) {
                  dateCellBg = 'bg-blue-50';
                  dateTextClass = 'text-blue-700';
                  dayTextClass = 'text-blue-400';
                }

                return (
                  <tr key={dateStr} className={`transition-colors ${rowBgClass}`}>
                    {/* 左固定セル (日付・夕食カウント) */}
                    <td className={`sticky left-0 z-20 p-1 sm:p-2 border-b border-slate-400 border-r border-slate-300 ${dateCellBg} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] bg-clip-padding`}>
                      <div className="flex flex-col items-center justify-center text-center h-full">
                        <span className={`text-sm sm:text-base font-black leading-none ${dateTextClass}`}>{date.getDate()}</span>
                        <span className={`text-[8px] sm:text-[10px] font-bold ${dayTextClass}`}>({['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]})</span>
                        
                        {/* 祝日名を表示 */}
                        {isHoliday && (
                          <span className="text-[6px] sm:text-[8px] text-red-500 font-bold leading-tight mt-0.5 px-0.5 text-center break-words w-full">
                            {holidayName}
                          </span>
                        )}

                        <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-slate-200/50 flex flex-col items-center w-full">
                          <IconUtensils className={`w-3 h-3 sm:w-3.5 sm:h-3.5 mb-0.5 ${dinnerCount > 0 ? "text-orange-500" : "text-slate-300"}`} />
                          <span className={`text-[9px] sm:text-[11px] font-black leading-none ${dinnerCount > 0 ? "text-orange-600" : "text-slate-300"}`}>{dinnerCount}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* メンバーごとの予定セル */}
                    {members.map((member) => {
                      const items = schedules[dateStr]?.[member.id] || [];
                      
                      // 予定をSTATUS_OPTIONSの順序に固定ソートする
                      const sortedItems = [...items].sort((a, b) => {
                        const idA = typeof a === 'string' ? a : a.id;
                        const idB = typeof b === 'string' ? b : b.id;
                        const indexA = STATUS_OPTIONS.findIndex(o => o.id === idA);
                        const indexB = STATUS_OPTIONS.findIndex(o => o.id === idB);
                        const orderA = indexA !== -1 ? indexA : 999;
                        const orderB = indexB !== -1 ? indexB : 999;
                        return orderA - orderB;
                      });

                      return (
                        <td key={`${dateStr}-${member.id}`} className="p-0.5 sm:p-1.5 cursor-pointer align-top border-b border-slate-200 border-r border-slate-200 last:border-r-0 overflow-hidden bg-clip-padding" onClick={() => { setSelectedCell({ dateStr, memberId: member.id }); setIsModalOpen(true); }}>
                          {/* グリッドレイアウトで予定をタイル状に配置 */}
                          <div className={`rounded-md sm:rounded-xl p-0.5 sm:p-1.5 min-h-[50px] sm:min-h-[90px] grid grid-cols-1 sm:grid-cols-2 gap-0.5 sm:gap-1 border-2 border-transparent bg-white/50 hover:border-indigo-200 transition-all overflow-hidden`}>
                            {sortedItems.length === 0 ? <div className="col-span-1 sm:col-span-2 text-[8px] sm:text-[10px] text-slate-300 italic flex items-center justify-center opacity-50">予定なし</div> :
                              sortedItems.map((item, i) => {
                                const id = typeof item === 'string' ? item : item.id;
                                const detail = typeof item === 'string' ? null : item.detail;
                                const opt = STATUS_OPTIONS.find(o => o.id === id);
                                if (!opt) return null;
                                const SIcon = opt.Icon;
                                return (
                                  <div key={i} className={`flex flex-col items-center justify-center p-0.5 sm:p-1 rounded sm:rounded-lg ${opt.color} border border-slate-200 shadow-sm transition-transform active:scale-95 overflow-hidden`}>
                                    <SIcon {...(opt.iconProps || {})} className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-[7.5px] sm:text-[10px] font-bold text-slate-800 leading-tight mt-0.5 text-center truncate w-full">{opt.label}</span>
                                    {detail && (
                                      <span className="text-[6px] sm:text-[8px] text-indigo-700 font-bold mt-0.5 bg-white/70 px-0.5 sm:px-1 rounded truncate w-full text-center tracking-tighter leading-tight" title={detail}>
                                        {detail}
                                      </span>
                                    )}
                                  </div>
                                );
                              })
                            }
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Main Schedule Input Modal */}
      {isModalOpen && selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex flex-col text-left">
                <h3 className="font-black text-slate-800 text-lg tracking-tight">予定をセット</h3>
                <p className="text-xs text-indigo-600 font-bold">{members.find(m => m.id === selectedCell.memberId)?.name} さん / {selectedCell.dateStr}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all">完了</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/30">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b-2 border-slate-200/60 border-dashed">
                {STATUS_OPTIONS.filter(o => ['no_dinner', 'day_off'].includes(o.id)).map((opt) => {
                  const items = schedules[selectedCell.dateStr]?.[selectedCell.memberId] || [];
                  const found = items.find(i => (typeof i === 'string' ? i : i.id) === opt.id);
                  const isSelected = !!found;
                  const OptIcon = opt.Icon;

                  const activeBorder = opt.id === 'no_dinner' ? 'border-red-400 ring-red-100' : 'border-orange-400 ring-orange-100';
                  const activeBg = opt.id === 'no_dinner' ? 'bg-red-50 text-red-800' : 'bg-orange-50 text-orange-800';
                  const activeBadge = opt.id === 'no_dinner' ? 'bg-red-500' : 'bg-orange-500';

                  return (
                    <button 
                      key={opt.id} 
                      onClick={() => toggleStatus(opt.id)} 
                      className={`relative flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all shadow-sm active:scale-95 ${isSelected ? `${activeBorder} ${activeBg} shadow-md ring-4` : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <OptIcon {...(opt.iconProps || {})} className={isSelected ? '' : 'opacity-60'} />
                      <span className="font-black text-sm tracking-tight">{opt.label}</span>
                      {isSelected && <div className={`absolute -top-2 -right-2 text-white rounded-full p-1.5 shadow-lg ${activeBadge}`}><IconCheck className="w-3.5 h-3.5" /></div>}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {STATUS_OPTIONS.filter(o => !['no_dinner', 'day_off'].includes(o.id)).map((opt) => {
                  const items = schedules[selectedCell.dateStr]?.[selectedCell.memberId] || [];
                  const found = items.find(i => (typeof i === 'string' ? i : i.id) === opt.id);
                  const isSelected = !!found;
                  const OptIcon = opt.Icon;

                  return (
                    <div key={opt.id} className="flex flex-col gap-2">
                      <button onClick={() => toggleStatus(opt.id)} className={`relative flex items-center gap-3 p-4 rounded-3xl border-2 transition-all text-left ${opt.color} ${isSelected ? 'border-indigo-500 bg-white shadow-xl shadow-indigo-100 ring-2 ring-indigo-50' : 'border-transparent hover:border-slate-200 opacity-80 hover:opacity-100'}`}>
                        <div className="p-2.5 bg-white rounded-2xl shadow-sm"><OptIcon {...(opt.iconProps || {})} /></div>
                        <span className="font-black text-sm text-slate-700 tracking-tight">{opt.label}</span>
                        {isSelected && <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-2 shadow-lg"><IconCheck className="w-3 h-3" /></div>}
                      </button>

                      {isSelected && opt.hasDetail === 'periods' && (
                        <div className="flex flex-wrap gap-1.5 p-3 bg-white rounded-2xl border border-indigo-100 shadow-sm justify-center">
                          {[1,2,3,4,5,6].map(p => {
                            const detail = found.detail || "";
                            const isPSelected = detail.includes(`${p}`);
                            return (
                              <button key={p} onClick={() => {
                                const currentArr = detail ? detail.replace('限','').split(',').filter(x => x) : [];
                                const nextArr = isPSelected ? currentArr.filter(x => x !== `${p}`) : [...currentArr, `${p}`].sort();
                                updateDetail(opt.id, nextArr.length > 0 ? `${nextArr.join(',')}限` : "");
                              }} className={`w-10 h-10 rounded-xl text-xs font-black transition-all border-2 ${isPSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{p}</button>
                            );
                          })}
                        </div>
                      )}

                      {isSelected && opt.hasDetail === 'work_type' && (
                        <div className="flex gap-2 p-2 bg-white rounded-2xl border border-indigo-100 shadow-sm">
                          {['在宅', '出社'].map(t => (
                            <button key={t} onClick={() => updateDetail(opt.id, t)} className={`flex-1 py-2 rounded-xl text-xs font-black border-2 transition-all ${found.detail === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{t}</button>
                          ))}
                        </div>
                      )}

                      {isSelected && opt.hasDetail === 'time_range' && (
                        <div className="p-3 bg-white rounded-2xl border border-indigo-100 shadow-sm space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 ml-1 text-left block">START</label>
                            <DetailInput 
                              type="time" 
                              initialValue={found.detail?.split('〜')[0] || ""} 
                              defaultTime="09:00"
                              onSave={(v) => {
                                const end = found.detail?.split('〜')[1];
                                const newEnd = end || calculateEndTime(v);
                                updateDetail(opt.id, `${v}〜${newEnd}`);
                              }} 
                            />
                          </div>
                          <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 ml-1 text-left block">END</label>
                            <DetailInput 
                              type="time" 
                              initialValue={found.detail?.split('〜')[1] || ""} 
                              defaultTime={() => {
                                const start = found.detail?.split('〜')[0] || "09:00";
                                return calculateEndTime(start);
                              }}
                              onSave={(v) => {
                                const start = found.detail?.split('〜')[0] || "09:00";
                                updateDetail(opt.id, `${start}〜${v}`);
                              }} 
                            />
                          </div>
                        </div>
                      )}

                      {isSelected && opt.hasDetail === 'time_single' && (
                        <div className="p-3 bg-white rounded-2xl border border-indigo-100 shadow-sm space-y-1 text-left">
                          <label className="text-[10px] font-black text-slate-400 ml-1 block">帰宅予定時間</label>
                          <DetailInput 
                            type="time" 
                            initialValue={found.detail || ""} 
                            defaultTime="09:00"
                            onSave={(v) => updateDetail(opt.id, v)} 
                          />
                        </div>
                      )}

                      {isSelected && opt.hasDetail === 'text' && (
                        <div className="p-3 bg-white rounded-2xl border border-indigo-100 shadow-sm text-left">
                          <label className="text-[10px] font-black text-slate-400 ml-1 mb-1 block">自由入力メモ</label>
                          <DetailInput 
                            initialValue={found.detail || ""} 
                            onSave={(v) => updateDetail(opt.id, v)} 
                            placeholder="内容を入力..."
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}>
          <div className="bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden w-full max-w-3xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-white/10 rounded-2xl shadow-inner"><IconUser /></div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Family Members</span>
                  <span className="text-xl font-black tracking-tight text-white">メンバー設定</span>
                </div>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="px-5 py-2.5 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-colors">閉じる</button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {members.map((member, idx) => (
                  <div key={`manage-${member.id}`} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center flex-1 min-w-0 mr-2">
                      <div className="flex flex-col mr-3 gap-1">
                        <button onClick={() => {
                          if (idx === 0) return;
                          const newMembers = [...members];
                          [newMembers[idx - 1], newMembers[idx]] = [newMembers[idx], newMembers[idx - 1]];
                          setDoc(doc(db, 'config', 'members_list'), { members: newMembers });
                        }} className={`p-1 rounded transition-colors ${idx === 0 ? 'opacity-20 cursor-default' : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'}`}>
                          <IconChevronUp />
                        </button>
                        <button onClick={() => {
                          if (idx === members.length - 1) return;
                          const newMembers = [...members];
                          [newMembers[idx + 1], newMembers[idx]] = [newMembers[idx], newMembers[idx + 1]];
                          setDoc(doc(db, 'config', 'members_list'), { members: newMembers });
                        }} className={`p-1 rounded transition-colors ${idx === members.length - 1 ? 'opacity-20 cursor-default' : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'}`}>
                          <IconChevronDown />
                        </button>
                      </div>
                      <span className="text-white text-base font-bold truncate">{member.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setMemberModal({isOpen: true, type: 'edit', id: member.id, name: member.name})} className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl hover:bg-indigo-500/40 transition-colors shrink-0" title="名前を変更">
                        <IconEdit />
                      </button>
                      <button onClick={() => setMemberModal({isOpen: true, type: 'delete', id: member.id, name: member.name})} className="p-2.5 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/40 transition-colors shrink-0" title="削除">
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                ))}
                
                {members.length < 6 && (
                  <button onClick={() => setMemberModal({isOpen: true, type: 'add', id: null, name: ''})} className="flex items-center justify-center gap-2 p-4 bg-white text-slate-900 font-black rounded-2xl text-base shadow-lg active:scale-95 transition-all hover:bg-indigo-50 h-full min-h-[64px]">
                    <IconPlus /> 追加
                  </button>
                )}
              </div>
              {members.length >= 6 && <p className="text-xs text-white/40 text-center italic mt-4">メンバーは最大6名まで登録可能です</p>}
            </div>
          </div>
        </div>
      )}

      {/* Member Management Modal (Over Settings) */}
      {memberModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => setMemberModal({ ...memberModal, isOpen: false })}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-800 text-lg tracking-tight">
                {memberModal.type === 'add' ? 'メンバーを追加' : memberModal.type === 'edit' ? '名前を変更' : 'メンバーを削除'}
              </h3>
            </div>
            <div className="p-6">
              {memberModal.type === 'delete' ? (
                <p className="text-slate-600 font-bold leading-relaxed">{memberModal.name} さんを削除しますか？<br/><span className="text-red-500 text-sm mt-2 inline-block">※この操作は取り消せません</span></p>
              ) : (
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="名前を入力..."
                  value={memberModal.name}
                  onChange={e => setMemberModal({ ...memberModal, name: e.target.value })}
                  autoFocus
                />
              )}
            </div>
            <div className="p-4 bg-slate-50 flex gap-3 border-t border-slate-100">
              <button onClick={() => setMemberModal({ ...memberModal, isOpen: false })} className="flex-1 py-3 bg-white text-slate-600 rounded-xl font-bold border border-slate-200 hover:bg-slate-100 transition-colors">キャンセル</button>
              <button 
                onClick={async () => {
                  let newMembers = [...members];
                  if (memberModal.type === 'add') {
                    if (!memberModal.name.trim()) return;
                    const maxId = members.length > 0 ? Math.max(...members.map(m => Number(m.id) || 0)) : -1;
                    newMembers.push({ id: String(maxId + 1), name: memberModal.name.trim() });
                  } else if (memberModal.type === 'edit') {
                    if (!memberModal.name.trim()) return;
                    const idx = newMembers.findIndex(m => m.id === memberModal.id);
                    if (idx !== -1) newMembers[idx].name = memberModal.name.trim();
                  } else if (memberModal.type === 'delete') {
                    newMembers = newMembers.filter(m => m.id !== memberModal.id);
                  }
                  await setDoc(doc(db, 'config', 'members_list'), { members: newMembers });
                  setMemberModal({ isOpen: false, type: 'add', id: null, name: '' });
                }} 
                className={`flex-1 py-3 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all ${memberModal.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {memberModal.type === 'delete' ? '削除する' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Previous Week Modal */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsCopyModalOpen(false)}>
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-2xl overflow-hidden w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full">
                <IconCopy />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">次週へ予定をコピー</h3>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">
                <span className="text-slate-800 bg-slate-100 px-2 py-1 rounded">
                  {dateList[0].toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} 〜 {dateList[6].toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </span>
                <br/>の予定を、そのまま<br/>
                <span className="text-indigo-700 bg-indigo-50 px-2 py-1 rounded mt-1 inline-block">
                  {dateList[7].toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} 〜 {dateList[13].toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </span>
                <br/>にコピーしますか？<br/>
                <span className="text-xs text-red-500 mt-2 inline-block">※コピー先のすでにある予定は上書きされます。</span>
              </p>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button onClick={() => setIsCopyModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">キャンセル</button>
              <button onClick={copyToNextWeek} className="flex-1 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all hover:bg-indigo-700">コピーを実行</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}