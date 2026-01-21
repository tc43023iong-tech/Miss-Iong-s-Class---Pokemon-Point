
import React from 'react';
import { Student, Behavior } from '../types';
import { POKEMON_SPRITE_URL } from '../constants';

interface FeedbackModalProps {
  student: Student;
  behavior: Behavior | { label: string; labelEn: string; points: number };
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ student, behavior, onClose }) => {
  const isPositive = behavior.points > 0;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/30 backdrop-blur-2xl p-4">
      {/* Background Candy Swirls */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${isPositive ? 'bg-[radial-gradient(circle_at_top_left,_#bfffda_0%,_transparent_50%)]' : 'bg-[radial-gradient(circle_at_top_left,_#ffbfdf_0%,_transparent_50%)]'}`}></div>
        <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_bottom_right,_#bfdaff_0%,_transparent_50%)]"></div>
      </div>

      {/* Main Modal Card - Candy Roundness */}
      <div className={`relative w-full max-w-[420px] aspect-square flex flex-col items-center justify-center p-12 rounded-[6rem] text-center shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-[16px] border-white transform transition-all animate-bounce-slow overflow-visible ${isPositive ? 'bg-mint-50/95' : 'bg-pink-50/95'}`}>
        
        {/* Top Header Floating Badge */}
        <div className={`absolute -top-8 left-1/2 -translate-x-1/2 px-14 py-4 rounded-full font-black text-white shadow-2xl border-4 border-white whitespace-nowrap text-lg tracking-[0.2em] z-30 pokemon-font transform -rotate-1 ${isPositive ? 'bg-gradient-to-r from-mint-400 to-mint-500' : 'bg-gradient-to-r from-pink-400 to-pink-500'}`}>
          {isPositive ? 'SO SWEET! 🍬' : 'DON\'T GIVE UP! 🍭'}
        </div>

        {/* Content Group */}
        <div className="mb-8 z-10">
          <h2 className={`text-3xl font-black pokemon-font drop-shadow-sm leading-none uppercase tracking-tight ${isPositive ? 'text-mint-600' : 'text-pink-600'}`}>
            {isPositive ? 'CONGRATULATIONS!' : 'KEEP WORKING HARD!'}
          </h2>
          <span className={`text-2xl font-black opacity-80 mt-2 block ${isPositive ? 'text-mint-700' : 'text-pink-700'}`}>
            {isPositive ? '恭喜你！太棒了' : '繼續努力！加油'}
          </span>
        </div>

        {/* Central Pokemon Display */}
        <div className="relative w-48 h-48 mb-8 z-10">
           {/* Soft glow background */}
           <div className={`absolute inset-0 rounded-full blur-3xl opacity-40 animate-pulse ${isPositive ? 'bg-mint-300' : 'bg-pink-300'}`}></div>
           <div className="relative z-10 w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white shadow-[0_15px_50px_rgba(0,0,0,0.1)]">
            <img 
              src={POKEMON_SPRITE_URL(student.pokemonId)} 
              alt="pokemon" 
              className="w-40 h-40 drop-shadow-md transform hover:scale-110 transition-transform"
            />
            
            {/* Glossy Point Bubble */}
            <div className={`absolute -top-4 -right-4 w-20 h-20 min-w-[80px] min-h-[80px] rounded-full flex flex-col items-center justify-center text-white font-black shadow-2xl border-4 border-white transform rotate-12 z-40 ${isPositive ? 'bg-gradient-to-br from-mint-300 to-mint-500 animate-bounce' : 'bg-gradient-to-br from-pink-300 to-pink-500 animate-pulse'}`}>
              <span className="text-[10px] leading-none mb-0.5 font-black uppercase tracking-widest">POINTS</span>
              <span className="text-3xl leading-none">{behavior.points > 0 ? `+${behavior.points}` : behavior.points}</span>
              {/* Highlight effect */}
              <div className="absolute top-2 left-3 w-4 h-4 bg-white/30 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>

        {/* Student Name */}
        <div className="mb-6 z-10">
          <p className="text-[11px] font-black text-gray-400/50 uppercase tracking-[0.6em] mb-1">STUDENT NO.{student.studentNumber}</p>
          <h3 className="text-5xl font-black text-gray-800 tracking-tighter pokemon-font">{student.name}</h3>
        </div>

        {/* Behavior Label and Stats */}
        <div className="space-y-4 z-10 w-full">
          <div className={`inline-block py-3 px-10 rounded-[2rem] font-black text-lg border-4 border-white shadow-xl ${isPositive ? 'bg-mint-200 text-mint-700' : 'bg-pink-200 text-pink-700'}`}>
            {behavior.label}
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Total Score / 目前總分</span>
            <div className={`text-4xl font-black leading-none px-6 py-2 rounded-2xl bg-white shadow-inner border-2 border-white ${student.totalScore >= 0 ? 'text-sky-400' : 'text-pink-400'}`}>
               {student.totalScore}
            </div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 -right-8 text-5xl animate-spin-slow opacity-30">⭐</div>
        <div className="absolute bottom-1/4 -left-8 text-4xl animate-bounce opacity-30">🍭</div>
        <div className="absolute top-3/4 right-0 text-3xl animate-pulse opacity-20">🍬</div>
      </div>
    </div>
  );
};
