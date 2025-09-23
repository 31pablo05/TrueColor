import React from 'react';

const Header: React.FC = () => (
  <header className="relative w-full py-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl backdrop-blur-xl animate-fade-in">
  <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center">
      {/* Logo centrado grande */}
      <div className="flex flex-col items-center justify-center mb-4 animate-fade-in">
  <img src="/svg logo/4.svg" alt="Logo TrueColor" className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 mb-2 drop-shadow-2xl transition-all duration-700 md:animate-spin-slow hover:scale-105" />
      </div>
      {/* Botón de tema claro/oscuro alineado a la derecha y más pequeño */}
  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex gap-2 animate-fade-in">
        <button
          className={`rounded-full p-3 sm:p-2 text-lg hover:bg-gray-200 transition-colors duration-200 bg-white/80 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white`}
          title="Tema claro"
          onClick={() => window.dispatchEvent(new CustomEvent('setTheme', { detail: 'light' }))}
        >
          🌞
        </button>
        <button
          className={`rounded-full p-3 sm:p-2 text-lg text-yellow-300 hover:bg-gray-800 transition-colors duration-200 bg-gray-900/80 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white`}
          title="Tema oscuro"
          onClick={() => window.dispatchEvent(new CustomEvent('setTheme', { detail: 'dark' }))}
        >
          🌙
        </button>
      </div>
      <p className="text-blue-100 text-base sm:text-lg font-light text-center animate-fade-in mb-2">
        Extrae colores perfectos de cualquier imagen
      </p>
      {/* Botón 'Ir al contenido' eliminado */}
    </div>
  </header>
);

export default Header;
