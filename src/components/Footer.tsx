import React, { useState, useEffect } from 'react';

interface FooterProps {
  theme?: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ theme = 'light' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const year = new Date().getFullYear();
  const version = 'v1.0.0';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const footerElement = document.querySelector('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const footer = document.querySelector('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const footer = document.querySelector('footer');
    footer?.addEventListener('mousemove', handleMouseMove);
    return () => footer?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const socialLinks = [
    {
      href: 'https://devcraftpablo.online/',
      icon: '🌐',
      label: 'Web Personal',
      color: 'from-blue-400 to-cyan-400',
      hoverColor: 'hover:from-blue-500 hover:to-cyan-500'
    },
    {
      href: 'https://github.com/31pablo05',
      icon: '🐙',
      label: 'GitHub',
      color: 'from-gray-400 to-gray-600',
      hoverColor: 'hover:from-gray-500 hover:to-gray-700'
    },
    {
      href: 'mailto:pabloproboste64@gmail.com',
      icon: '✉️',
      label: 'Email',
      color: 'from-pink-400 to-rose-400',
      hoverColor: 'hover:from-pink-500 hover:to-rose-500'
    }
  ];

  const features = [
    { icon: '🎨', text: 'Color Picker' },
    { icon: '📊', text: 'Paletas' },
    { icon: '💾', text: 'Historial' },
    { icon: '⚡', text: 'Instantáneo' }
  ];

  return (
    <footer className="relative w-full mt-auto overflow-hidden">
      {/* Fondo con efectos múltiples */}
      <div className="absolute inset-0">
        {/* Gradiente base */}
        <div className={`absolute inset-0 transition-all duration-1000 ${
          theme === 'dark'
            ? 'bg-gradient-to-t from-gray-900 via-purple-900 to-indigo-900'
            : 'bg-gradient-to-t from-indigo-800 via-purple-700 to-blue-600'
        }`} />
        
        {/* Efecto de ondas invertidas */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <svg className="absolute top-0 w-full h-20" viewBox="0 0 100 20" preserveAspectRatio="none">
            <defs>
              <linearGradient id="footer-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
              </linearGradient>
            </defs>
            <path
              d="M0,20 Q25,15 50,20 T100,20 V0 H0 Z"
              fill="url(#footer-wave-gradient)"
              className="animate-wave-up"
            />
            <path
              d="M0,20 Q25,10 50,20 T100,20 V0 H0 Z"
              fill="rgba(255,255,255,0.1)"
              className="animate-wave-up-reverse"
            />
          </svg>
        </div>

        {/* Partículas flotantes */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float-particles"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${20 + Math.random() * 60}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        {/* Efecto de seguimiento del mouse */}
        <div
          className="absolute pointer-events-none transition-all duration-500 ease-out"
          style={{
            left: mousePosition.x - 150,
            top: mousePosition.y - 150,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Líneas decorativas animadas */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent animate-line-flow"
              style={{
                left: '0',
                right: '0',
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Sección principal */}
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            
            {/* Logo y información principal */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
              
              {/* Logo con efectos */}
              <div className="flex flex-col items-center lg:items-start gap-4">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700 scale-150" />
                  
                  <img
                    src="/svg logo/4.svg"
                    alt="TrueColor Logo"
                    className="h-16 w-16 sm:h-20 sm:w-20 relative z-10 drop-shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-12"
                  />
                  
                  {/* Anillo decorativo */}
                  <div className="absolute inset-0 border-2 border-white/20 rounded-full scale-125 group-hover:scale-150 opacity-0 group-hover:opacity-50 transition-all duration-700" />
                </div>
                
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">TrueColor</h3>
                  <p className="text-blue-100 text-sm max-w-xs">
                    La herramienta profesional para extraer colores perfectos de cualquier imagen
                  </p>
                </div>
              </div>

              {/* Características */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 transform ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <span className="text-2xl mb-1">{feature.icon}</span>
                    <span className="text-xs text-white/80 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Línea divisoria animada */}
            <div className="relative mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="absolute inset-0 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50 animate-pulse-line" />
            </div>

            {/* Información del desarrollador y enlaces */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Información del desarrollador */}
              <div className={`flex flex-col md:flex-row items-center gap-4 transform transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-blue-100">Creado con</span>
                  <span className="text-2xl animate-pulse-heart">💗</span>
                  <span className="text-blue-100">por</span>
                </div>
                
                <a
                  href="https://devcraftpablo.online/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-white font-semibold">Pablo Proboste</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-all duration-300" />
                </a>
              </div>

              {/* Enlaces sociales */}
              <div className={`flex gap-3 transform transition-all duration-1000 delay-500 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}>
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-xl bg-gradient-to-r ${link.color} ${link.hoverColor} transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl`}
                    title={link.label}
                    aria-label={link.label}
                  >
                    <span className="text-xl text-white relative z-10">{link.icon}</span>
                    
                    {/* Efecto de glow */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-50 blur-md transition-all duration-300 rounded-xl scale-150`} />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                      {link.label}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright y versión */}
            <div className={`mt-8 pt-6 border-t border-white/10 text-center transform transition-all duration-1000 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <p className="text-xs text-blue-100/80">
                  &copy; {year} TrueColor. Todos los derechos reservados.
                </p>
                
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70 border border-white/20">
                    {version}
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-300 border border-green-400/30">
                    ✓ Activo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Borde superior decorativo */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
    </footer>
  );
};

export default Footer;