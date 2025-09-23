import React, { useState, useEffect } from 'react';

interface HeaderProps {
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ theme = 'light', onThemeChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleThemeToggle = (newTheme: 'light' | 'dark') => {
    if (onThemeChange) {
      onThemeChange(newTheme);
    } else {
      window.dispatchEvent(new CustomEvent('setTheme', { detail: newTheme }));
    }
  };

  return (
    <header className="relative w-full overflow-hidden">
      {/* Fondo con gradiente animado y efectos */}
      <div className="absolute inset-0">
        {/* Gradiente principal */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ${
            theme === 'dark' 
              ? 'from-gray-900 via-purple-900 to-indigo-900' 
              : 'from-blue-600 via-purple-600 to-indigo-600'
          }`}
        />
        
        {/* Efecto de partículas/puntos luminosos */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Efecto de seguimiento del mouse */}
        <div
          className="absolute pointer-events-none transition-all duration-700 ease-out"
          style={{
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            transform: 'translate3d(0,0,0)',
          }}
        />

        {/* Ondas animadas */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
              </linearGradient>
            </defs>
            <path
              d="M0,10 Q25,5 50,10 T100,10 V20 H0 Z"
              fill="url(#wave-gradient)"
              className="animate-wave"
            />
            <path
              d="M0,15 Q25,10 50,15 T100,15 V20 H0 Z"
              fill="rgba(255,255,255,0.1)"
              className="animate-wave-reverse"
            />
          </svg>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* Botones de tema mejorados */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <div className="flex gap-2 p-1 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl">
            <button
              className={`group relative rounded-xl p-3 transition-all duration-300 ${
                theme === 'light' 
                  ? 'bg-white text-gray-800 shadow-lg scale-105' 
                  : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              title="Tema claro"
              onClick={() => handleThemeToggle('light')}
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200 block">
                🌞
              </span>
              {theme === 'light' && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse" />
              )}
            </button>
            
            <button
              className={`group relative rounded-xl p-3 transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-yellow-300 shadow-lg scale-105' 
                  : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              title="Tema oscuro"
              onClick={() => handleThemeToggle('dark')}
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200 block">
                🌙
              </span>
              {theme === 'dark' && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Contenido central */}
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Logo con efectos avanzados */}
          <div 
            className={`relative mb-6 transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Glow effect detrás del logo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-30 blur-3xl scale-150 animate-pulse-slow" />
            
            {/* Anillo orbital */}
            <div className={`absolute inset-0 rounded-full border-2 border-white/30 scale-125 transition-all duration-700 ${
              isHovered ? 'rotate-180 scale-150 opacity-60' : 'rotate-0 scale-125 opacity-30'
            }`} 
            style={{ animation: 'orbit 20s linear infinite' }} />
            
            <div className="relative">
              <img 
                src="/svg logo/4.svg" 
                alt="TrueColor Logo" 
                className={`h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 drop-shadow-2xl transition-all duration-700 ${
                  isHovered ? 'scale-110 rotate-12 brightness-110' : 'scale-100 rotate-0'
                }`}
                style={{ 
                  filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5))',
                  animation: isHovered ? 'float-gentle 2s ease-in-out infinite' : undefined
                }}
              />
            </div>
          </div>

          {/* Título principal con efectos de texto */}
          <div className={`transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 relative">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-gradient-x">
                TrueColor Extractor
              </span>
              {/* Efecto de brillo que pasa por el texto */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-shine" />
            </h1>
          </div>

          {/* Subtítulo con animación */}
          <div className={`transform transition-all duration-1000 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <p className="text-blue-100 text-base sm:text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Extrae colores perfectos de cualquier imagen con 
              <span className="font-semibold text-white"> precisión profesional</span>
            </p>
          </div>

          {/* Indicadores de características */}
          <div className={`flex flex-wrap justify-center gap-4 mt-6 transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {[
              { icon: '🎯', text: 'Precisión perfecta' },
              { icon: '⚡', text: 'Instantáneo' },
              { icon: '🎨', text: 'Múltiples formatos' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm font-medium text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Efecto de borde inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 shadow-lg" />
    </header>
  );
};

export default Header;