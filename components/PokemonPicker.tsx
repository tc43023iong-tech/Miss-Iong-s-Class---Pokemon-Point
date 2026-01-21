
import React, { useState } from 'react';
import { POKEMON_COUNT, POKEMON_SPRITE_URL } from '../constants';

interface PokemonPickerProps {
  onSelect: (id: number) => void;
  onClose: () => void;
}

export const PokemonPicker: React.FC<PokemonPickerProps> = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const ids = Array.from({ length: POKEMON_COUNT }, (_, i) => i + 1);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-100/60 backdrop-blur-xl p-4">
      <div className="bg-white rounded-[4rem] w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden candy-border border-[12px] border-white">
        <div className="bg-gradient-to-r from-sky-200 via-lavender-100 to-peach-100 p-8 flex justify-between items-center">
          <h3 className="text-3xl font-black pokemon-font text-gray-700 tracking-tight">Choose Your Avatar! / 選擇你的寶可夢</h3>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center bg-white/50 hover:bg-white rounded-full text-3xl font-bold transition-all transform hover:rotate-90"
          >
            &times;
          </button>
        </div>
        
        <div className="p-8 bg-gradient-to-b from-white/50 to-transparent">
           <input 
             type="number" 
             placeholder="Search by ID (1-500)..."
             className="w-full p-5 rounded-[2rem] border-none bg-sky-50 focus:ring-4 focus:ring-sky-200 outline-none font-bold text-xl shadow-inner text-sky-600 placeholder:text-sky-200"
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6 bg-lavender-50/20">
          {ids.filter(id => id.toString().includes(search)).map(id => (
            <button 
              key={id} 
              onClick={() => onSelect(id)}
              className="group p-3 bg-white/80 rounded-3xl border-4 border-transparent hover:border-peach-200 hover:bg-white hover:shadow-xl transition-all flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img 
                  src={POKEMON_SPRITE_URL(id)} 
                  alt={`pokemon-${id}`} 
                  className="w-14 h-14 drop-shadow-sm"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] text-lavender-300 font-black mt-2">#{id}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
