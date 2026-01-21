
import React, { useState, useEffect, useCallback } from 'react';
import { ClassData, Student, SortType, Behavior } from './types';
import { 
  INITIAL_CLASSES, 
  POSITIVE_BEHAVIORS, 
  NEGATIVE_BEHAVIORS, 
  POKEMON_SPRITE_URL,
  POKEMON_COUNT
} from './constants';
import { Fireworks } from './components/Fireworks';
import { PokemonPicker } from './components/PokemonPicker';
import { FeedbackModal } from './components/FeedbackModal';
import { RandomPickerModal } from './components/RandomPickerModal';

const STORAGE_KEY = 'miss_iong_class_data_v2';

const playAudio = (url: string, volume: number = 0.5) => {
  try {
    const audio = new Audio(url);
    audio.volume = volume;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn("Audio playback prevented by browser policy:", error);
      });
    }
  } catch (err) {
    console.error("Audio initialization failed:", err);
  }
};

const App: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [sortType, setSortType] = useState<SortType>(SortType.ID_ASC);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [pickingPokemonFor, setPickingPokemonFor] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ student: Student, behavior: any } | null>(null);
  const [manualPoints, setManualPoints] = useState<number>(0);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassNamesList, setNewClassNamesList] = useState('');
  const [showManageMenu, setShowManageMenu] = useState(false);
  
  const [isRolling, setIsRolling] = useState(false);
  const [rollingStudent, setRollingStudent] = useState<Student | null>(null);

  const UP_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'; 
  const DOWN_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2021/2021-preview.mp3'; 
  const ROLL_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'; 
  const SUCCESS_SOUND = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setClasses(JSON.parse(saved));
      } catch (e) {
        setClasses(INITIAL_CLASSES);
      }
    } else {
      setClasses(INITIAL_CLASSES);
    }
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
    }
  }, [classes]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const currentClass = classes.find(c => c.id === selectedClassId);

  const updateStudent = useCallback((studentId: string, behavior: Behavior | { label: string, labelEn: string, points: number }) => {
    setClasses(prev => prev.map(cls => {
      if (cls.id !== selectedClassId) return cls;
      return {
        ...cls,
        students: cls.students.map(s => {
          if (s.id !== studentId) return s;
          const isPositive = behavior.points > 0;
          const updatedStudent = {
            ...s,
            totalScore: s.totalScore + behavior.points,
            posCount: isPositive ? s.posCount + Math.abs(behavior.points) : s.posCount,
            negCount: !isPositive ? s.negCount + Math.abs(behavior.points) : s.negCount
          };
          
          playAudio(isPositive ? UP_SOUND : DOWN_SOUND, isPositive ? 0.7 : 0.5);
          
          setFeedback({ student: updatedStudent, behavior });
          return updatedStudent;
        })
      };
    }));
    setActiveStudent(null);
  }, [selectedClassId]);

  const handleManualPoints = () => {
    if (!activeStudent) return;
    updateStudent(activeStudent.id, { 
      label: '手動輸入分數', 
      labelEn: 'Manual Point Entry', 
      points: manualPoints 
    });
    setManualPoints(0);
  };

  const handleCreateClass = () => {
    if (!newClassName.trim() || !newClassNamesList.trim()) return;
    const names = newClassNamesList.split('\n').map(n => n.trim()).filter(n => n !== '');
    const newClass: ClassData = {
      id: `custom_${Date.now()}`,
      name: newClassName.trim(),
      students: names.map((name, i) => ({
        id: `custom_${Date.now()}_${i + 1}`,
        name,
        studentNumber: i + 1,
        pokemonId: Math.floor(Math.random() * POKEMON_COUNT) + 1,
        totalScore: 0,
        posCount: 0,
        negCount: 0
      }))
    };
    setClasses(prev => [...prev, newClass]);
    setSelectedClassId(newClass.id);
    setIsAddingClass(false);
    setNewClassName('');
    setNewClassNamesList('');
    setShowManageMenu(false);
  };

  const deleteCurrentClass = () => {
    if (!selectedClassId) return;
    if (window.confirm('Delete this class? / 確定刪除此班級？')) {
      setClasses(prev => prev.filter(c => c.id !== selectedClassId));
      setSelectedClassId(null);
      setShowManageMenu(false);
    }
  };

  const setStudentPokemon = (id: number) => {
    if (!pickingPokemonFor) return;
    setClasses(prev => prev.map(cls => ({
      ...cls,
      students: cls.students.map(s => s.id === pickingPokemonFor ? { ...s, pokemonId: id } : s)
    })));
    setPickingPokemonFor(null);
  };

  const sortedStudents = currentClass ? [...currentClass.students].sort((a, b) => {
    if (sortType === SortType.ID_ASC) return a.studentNumber - b.studentNumber;
    if (sortType === SortType.SCORE_DESC) return b.totalScore - a.totalScore;
    if (sortType === SortType.SCORE_ASC) return a.totalScore - b.totalScore;
    return 0;
  }) : [];

  const randomSelect = () => {
    if (!currentClass || currentClass.students.length === 0) return;
    setIsRolling(true);
    
    const students = currentClass.students;
    const finalSelection = students[Math.floor(Math.random() * students.length)];
    let iterations = 0;
    const maxIterations = 20;
    
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * students.length);
      setRollingStudent(students[randomIdx]);
      playAudio(ROLL_SOUND, 0.2);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        playAudio(SUCCESS_SOUND, 0.7);
        setTimeout(() => {
          setIsRolling(false);
          setActiveStudent(finalSelection);
        }, 800);
      }
    }, 120);
  };

  const exportData = () => {
    const data = JSON.stringify(classes, null, 2);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Miss_Iong_Class_Data_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowManageMenu(false);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        setClasses(data);
        alert('Import Successful! / 導入成功！');
        setShowManageMenu(false);
      } catch (err) {
        alert('Invalid file format. / 檔案格式不正確。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen relative pb-20">
      <Fireworks />

      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/50 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-200 to-lavender-200 flex items-center justify-center candy-shadow group-hover:scale-110 transition-transform">
             <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="logo" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black pokemon-font bg-gradient-to-r from-pink-400 to-lavender-500 bg-clip-text text-transparent uppercase tracking-tighter">Miss Iong's Class</h1>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <select 
            className="p-3 border-none rounded-2xl font-bold bg-lavender-100/50 text-lavender-600 outline-none ring-2 ring-lavender-200/50 focus:ring-lavender-400 candy-shadow"
            value={selectedClassId || ''}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">SELECT CLASS / 選擇班級</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <div className="relative">
            <button 
              onClick={() => setShowManageMenu(!showManageMenu)}
              className="bg-mint-100/50 text-mint-600 px-6 py-3 rounded-2xl font-black shadow-md transition-all active:scale-95 flex items-center gap-2 ring-2 ring-mint-200/50 hover:bg-mint-200/50"
            >
              CLASS MGMT
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showManageMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showManageMenu && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white/95 backdrop-blur-lg rounded-[2rem] shadow-2xl border-4 border-white overflow-hidden z-50 animate-in zoom-in-95 duration-200">
                <button onClick={() => setIsAddingClass(true)} className="w-full text-left p-4 hover:bg-mint-50 text-mint-600 font-bold flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-mint-100 flex items-center justify-center">➕</span> Create / 創建班級
                </button>
                <button onClick={exportData} className="w-full text-left p-4 hover:bg-peach-50 text-peach-600 font-bold flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-peach-100 flex items-center justify-center">📦</span> Export / 導出數據
                </button>
                <label className="w-full text-left p-4 hover:bg-sky-50 text-sky-600 font-bold flex items-center gap-3 cursor-pointer">
                  <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">📂</span> Import / 導入數據
                  <input type="file" className="hidden" onChange={importData} accept=".txt" />
                </label>
                {selectedClassId && (
                  <button onClick={deleteCurrentClass} className="w-full text-left p-4 hover:bg-pink-50 text-pink-500 font-bold flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">🗑️</span> Delete / 刪除班級
                  </button>
                )}
              </div>
            )}
          </div>

          {selectedClassId && (
            <>
              <select 
                className="p-3 border-none rounded-2xl font-bold bg-peach-100/50 text-peach-600 outline-none ring-2 ring-peach-200/50 focus:ring-peach-400 candy-shadow"
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
              >
                <option value={SortType.ID_ASC}>By ID (學號排序)</option>
                <option value={SortType.SCORE_DESC}>High to Low (最高至最低)</option>
                <option value={SortType.SCORE_ASC}>Low to High (最低至最高)</option>
              </select>
              <button onClick={randomSelect} className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-pink-200 transform transition-all hover:-translate-y-1 active:scale-95">
                RANDOM / 隨機
              </button>
            </>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {!selectedClassId ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 bg-white/60 backdrop-blur-lg rounded-[5rem] shadow-2xl candy-border">
             <div className="animate-bounce-slow mb-8">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white to-sky-100 flex items-center justify-center candy-shadow">
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" alt="start" className="w-40 h-40" />
                </div>
             </div>
             <h2 className="text-5xl font-black text-peach-500 pokemon-font uppercase tracking-tight">Ready for Class?</h2>
             <p className="text-gray-400 mt-4 text-xl font-bold">Please select a class to begin the magic.</p>
             <p className="text-lavender-400 font-bold mt-2 text-lg">請在上方選擇一個班級開始上課。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedStudents.map((student, index) => (
              <div 
                key={student.id} 
                className="group relative bg-white/80 rounded-[3rem] p-6 shadow-xl candy-border hover:bg-white hover:-translate-y-2 transition-all cursor-pointer overflow-hidden"
                onClick={() => setActiveStudent(student)}
              >
                {/* Ranking Badge */}
                {sortType !== SortType.ID_ASC && (
                  <div className="absolute top-4 right-4 bg-gradient-to-br from-lavender-400 to-lavender-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg z-20">
                    RANK #{index + 1}
                  </div>
                )}

                {/* Card Background Glow */}
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-all group-hover:opacity-40 ${student.totalScore >= 0 ? 'bg-mint-400' : 'bg-pink-400'}`}></div>

                <div className="relative mb-6 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-b from-white to-sky-50 flex items-center justify-center candy-shadow border-4 border-white group-hover:scale-110 transition-transform relative">
                    <img 
                      src={POKEMON_SPRITE_URL(student.pokemonId)} 
                      alt="pokemon" 
                      className="w-28 h-28 drop-shadow-lg"
                    />
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPickingPokemonFor(student.id); }}
                    className="absolute bottom-0 right-4 bg-white hover:bg-peach-50 text-peach-500 p-2.5 rounded-full shadow-lg border-2 border-peach-100 transition-all active:scale-90"
                  >
                    🎨
                  </button>

                  <div className={`absolute -top-4 -left-4 w-14 h-14 rounded-full flex flex-col items-center justify-center font-black border-4 border-white text-xl shadow-lg transition-transform group-hover:scale-110 ${student.totalScore >= 0 ? 'bg-mint-400 text-white' : 'bg-pink-400 text-white'}`}>
                    <span className="text-[9px] leading-none mb-0.5">SCORE</span>
                    <span className="leading-none">{student.totalScore}</span>
                  </div>
                </div>

                <div className="text-center relative z-10">
                  <span className="text-xs font-black text-lavender-300 uppercase tracking-[0.4em]">NO.{student.studentNumber}</span>
                  <h3 className="text-2xl font-black text-gray-700 mt-1 tracking-tight">{student.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 w-full relative z-10">
                  <div className="bg-mint-50/50 rounded-3xl p-3 text-center candy-border border-mint-100">
                    <p className="text-[9px] font-black text-mint-400 uppercase tracking-widest">POS (+)</p>
                    <p className="text-xl font-black text-mint-500">{student.posCount}</p>
                  </div>
                  <div className="bg-pink-50/50 rounded-3xl p-3 text-center candy-border border-pink-100">
                    <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest">NEG (-)</p>
                    <p className="text-xl font-black text-pink-500">{student.negCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Manual Point Entry / Behavior Selection Modal */}
      {activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-lavender-100/60 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[5rem] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl candy-border border-[16px]">
            
            <div className="bg-gradient-to-r from-sky-200 via-lavender-200 to-pink-200 p-10 flex justify-between items-center text-gray-700 relative">
              <div className="flex items-center gap-8 relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                    <img src={POKEMON_SPRITE_URL(activeStudent.pokemonId)} className="w-20 h-20" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-pink-400 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-lg border-4 border-white">
                    #{activeStudent.studentNumber}
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black tracking-tight text-gray-800 pokemon-font">{activeStudent.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-white/60 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Class Performance</span>
                    <span className="bg-sky-400 text-white px-4 py-1 rounded-full text-sm font-black shadow-sm">TOTAL: {activeStudent.totalScore}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveStudent(null)} 
                className="w-16 h-16 flex items-center justify-center bg-white/50 hover:bg-white rounded-full text-4xl font-bold transition-all transform hover:rotate-90 shadow-sm"
              >
                &times;
              </button>
            </div>

            <div className="p-10 flex-1 overflow-y-auto grid md:grid-cols-2 gap-10 bg-gradient-to-b from-white to-lavender-50">
              {/* Positive Behaviors */}
              <div>
                <h4 className="text-2xl font-black text-mint-500 mb-6 flex items-center gap-4 pokemon-font">
                  <span className="w-12 h-12 rounded-full bg-mint-400 text-white flex items-center justify-center shadow-lg border-4 border-white">✨</span>
                  加分行為 / Positive
                </h4>
                <div className="grid gap-4">
                  {POSITIVE_BEHAVIORS.map((b, i) => (
                    <button 
                      key={i}
                      onClick={() => updateStudent(activeStudent.id, b)}
                      className="group w-full text-left p-5 rounded-[2.5rem] bg-white hover:bg-mint-50 border-4 border-transparent hover:border-mint-200 transition-all flex justify-between items-center shadow-md active:scale-[0.98]"
                    >
                      <div>
                        <p className="font-black text-gray-700 text-lg group-hover:text-mint-600">{b.label}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{b.labelEn}</p>
                      </div>
                      <div className="bg-mint-100 text-mint-500 w-12 h-12 rounded-full flex items-center justify-center font-black shadow-inner border-2 border-white">
                        +{b.points}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Negative Behaviors */}
              <div>
                <h4 className="text-2xl font-black text-pink-500 mb-6 flex items-center gap-4 pokemon-font">
                   <span className="w-12 h-12 rounded-full bg-pink-400 text-white flex items-center justify-center shadow-lg border-4 border-white">💔</span>
                   減分行為 / Negative
                </h4>
                <div className="grid gap-4">
                  {NEGATIVE_BEHAVIORS.map((b, i) => (
                    <button 
                      key={i}
                      onClick={() => updateStudent(activeStudent.id, b)}
                      className="group w-full text-left p-5 rounded-[2.5rem] bg-white hover:bg-pink-50 border-4 border-transparent hover:border-pink-200 transition-all flex justify-between items-center shadow-md active:scale-[0.98]"
                    >
                      <div>
                        <p className="font-black text-gray-700 text-lg group-hover:text-pink-600">{b.label}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{b.labelEn}</p>
                      </div>
                      <div className="bg-pink-100 text-pink-500 w-12 h-12 rounded-full flex items-center justify-center font-black shadow-inner border-2 border-white">
                        {b.points}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Manual Entry */}
                <div className="mt-10 bg-white/90 p-8 rounded-[3.5rem] shadow-xl candy-border border-lavender-100">
                  <label className="block text-[11px] font-black text-lavender-300 mb-4 uppercase tracking-[0.4em]">Custom Points / 自定義分數</label>
                  <div className="flex gap-4">
                    <input 
                      type="number" 
                      value={manualPoints}
                      onChange={(e) => setManualPoints(parseInt(e.target.value) || 0)}
                      className="flex-1 p-5 rounded-3xl bg-lavender-50 border-none focus:ring-4 focus:ring-lavender-200 font-black text-center text-lavender-600 text-3xl shadow-inner"
                      placeholder="0"
                    />
                    <button 
                      onClick={handleManualPoints}
                      className="bg-gradient-to-br from-lavender-400 to-lavender-500 text-white px-10 rounded-3xl font-black shadow-lg transform transition-all active:scale-95 border-4 border-white/20"
                    >
                      GO!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Modals (Picker, Feedback, Add Class) updated via sub-components */}
      {isAddingClass && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-peach-50/80 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[4rem] w-full max-w-xl p-10 shadow-2xl candy-border border-[12px]">
            <h3 className="text-3xl font-black text-peach-500 mb-8 text-center pokemon-font">Create New Class / 創建班級</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-peach-300 uppercase tracking-widest mb-2">Class Name / 班級名稱</label>
                <input 
                  type="text" 
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. 1A English"
                  className="w-full p-5 rounded-3xl bg-peach-50/50 border-none ring-2 ring-peach-100 focus:ring-4 focus:ring-peach-200 font-bold text-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-peach-300 uppercase tracking-widest mb-2">Student List / 學生姓名 (One per line)</label>
                <textarea 
                  rows={6}
                  value={newClassNamesList}
                  onChange={(e) => setNewClassNamesList(e.target.value)}
                  placeholder="John&#10;Mary&#10;..."
                  className="w-full p-5 rounded-3xl bg-peach-50/50 border-none ring-2 ring-peach-100 focus:ring-4 focus:ring-peach-200 font-bold resize-none text-lg"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsAddingClass(false)}
                  className="flex-1 py-5 rounded-3xl bg-gray-100 text-gray-500 font-black text-lg shadow-sm"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleCreateClass}
                  className="flex-1 py-5 rounded-3xl bg-gradient-to-br from-peach-400 to-peach-500 text-white font-black text-lg shadow-xl shadow-peach-100"
                >
                  CREATE!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isRolling && <RandomPickerModal student={rollingStudent} />}
      {pickingPokemonFor && <PokemonPicker onSelect={setStudentPokemon} onClose={() => setPickingPokemonFor(null)} />}
      {feedback && <FeedbackModal student={feedback.student} behavior={feedback.behavior} onClose={() => setFeedback(null)} />}

      <footer className="fixed bottom-0 w-full bg-white/40 backdrop-blur-md p-3 text-center text-[10px] font-black text-lavender-400 border-t border-white/50 z-30 uppercase tracking-[0.4em]">
        🍬 SWEET MANAGEMENT SYSTEM | &copy; 2024 MISS IONG'S CLASS 🍬
      </footer>
    </div>
  );
};

export default App;
