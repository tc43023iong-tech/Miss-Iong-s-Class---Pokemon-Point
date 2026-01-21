
import React from 'react';
import { Student } from '../types';
import { POKEMON_SPRITE_URL } from '../constants';

interface RandomPickerModalProps {
  student: Student | null;
}

export const RandomPickerModal: React.FC<RandomPickerModalProps> = ({ student }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-lavender-50/70 backdrop-blur-2xl p-4">
      {/* Floating Candy Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] text-6xl animate-bounce opacity-40">🍬</div>
        <div className="absolute top-[80%] right-[15%] text-6xl animate-bounce opacity-40" style={{ animationDelay: '0.5s' }}>🍭</div>
        <div className="absolute top-1/2 left-[5%] text-4xl animate-pulse opacity-20">✨</div>
        <div className="absolute bottom-1/4 right-[10%] text-5xl animate-bounce opacity-30">🎈</div>
        
        {/* Soft background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-200/20 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative text-center p-14 bg-white/95 rounded-[6rem] shadow-[0_50px_120px_rgba(186,230,253,0.5)] border-[16px] border-white transform transition-all animate-in zoom-in-95 duration-300">
        
        {/* Pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none">
          <div className="w-[120%] h-[120%] border-4 border-sky-100 rounded-full animate-ping opacity-20"></div>
          <div className="absolute w-[130%] h-[130%] border-8 border-pink-100/30 rounded-full animate-pulse"></div>
        </div>

        {/* Top Header */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-peach-400 to-pink-400 text-white px-16 py-4 rounded-full font-black shadow-2xl border-4 border-white whitespace-nowrap text-xl tracking-[0.2em] z-20 pokemon-font transform -rotate-1">
          LUCKY PICK! / 幸運同學
        </div>
        
        <div className="mt-6 mb-12 relative z-10">
          <h2 className="text-5xl font-black pokemon-font bg-gradient-to-r from-sky-400 to-lavender-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight leading-none mb-3">
            SWEET SURPRISE!
          </h2>
          <span className="text-gray-400 font-bold uppercase tracking-[0.5em] text-sm">正在尋找課堂之星...</span>
        </div>
        
        <div className="relative w-80 h-80 mx-auto mb-12 z-10">
           {/* Inner jelly glow */}
           <div className="absolute inset-0 bg-gradient-to-br from-white to-sky-50 rounded-full shadow-[inset_0_4px_30px_rgba(0,0,0,0.05)] border-4 border-sky-100/30 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8)_0%,_transparent_70%)]"></div>
           </div>
           
           <div className="relative z-10 w-full h-full flex items-center justify-center">
            <img 
              src={POKEMON_SPRITE_URL(student.pokemonId)} 
              alt="winner" 
              className="w-64 h-64 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] transition-transform transform scale-110 animate-bounce-slow"
            />
          </div>
        </div>
        
        <div className="relative z-10 py-8 px-20 rounded-[4rem] bg-gradient-to-b from-sky-400 to-sky-500 shadow-2xl shadow-sky-200 transform -rotate-1 border-4 border-white flex flex-col items-center">
          <p className="text-[10px] font-black text-sky-100 uppercase tracking-[0.6em] mb-2">TODAY'S CHAMPION</p>
          <p className="text-7xl font-black text-white tracking-tighter drop-shadow-lg pokemon-font">{student.name}</p>
          <div className="absolute -right-6 -top-6 bg-yellow-400 text-yellow-900 w-16 h-16 rounded-full flex flex-col items-center justify-center font-black border-4 border-white shadow-xl transform rotate-12">
            <span className="text-[10px]">NO.</span>
            <span className="text-xl leading-none">{student.studentNumber}</span>
          </div>
        </div>

        {/* Candy indicators */}
        <div className="mt-12 flex justify-center gap-6">
          <div className="w-5 h-5 bg-pink-300 rounded-full animate-bounce shadow-md"></div>
          <div className="w-5 h-5 bg-sky-300 rounded-full animate-bounce shadow-md" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-5 h-5 bg-peach-300 rounded-full animate-bounce shadow-md" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-5 h-5 bg-mint-300 rounded-full animate-bounce shadow-md" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>
    </div>
  );
};
