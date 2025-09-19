import React from 'react';

const Header: React.FC = () => (
  <header className="w-full py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl backdrop-blur-xl">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-3 mb-2 animate-fade-in">
          <span className="text-5xl animate-bounce drop-shadow-xl" aria-label="Paleta de color">🎨</span>
          <span className="text-4xl font-extrabold tracking-wide animate-gradient-x bg-gradient-to-r from-blue-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
            True Color
          </span>
        </div>
        <p className="text-blue-100 text-lg font-light text-center animate-fade-in">
          Extrae colores perfectos de cualquier imagen
        </p>
        <div className="mt-2 flex gap-4 animate-fade-in">
          <a href="#main" className="px-3 py-1 rounded-lg bg-white/20 text-blue-100 hover:bg-white/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Ir al contenido principal">Ir al contenido</a>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
