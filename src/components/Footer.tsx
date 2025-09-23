import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const version = 'v1.0.0';
  return (
  <footer className="w-full py-6 sm:py-8 bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 text-white mt-auto shadow-2xl backdrop-blur-xl animate-fade-in transition-all duration-700">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center">
  <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full animate-slide-right transition-all duration-700 delay-200">
          <div className="flex items-center gap-3 mb-4 md:mb-0 animate-zoom-in transition-all duration-700 delay-300">
            <img src="/svg logo/4.svg" alt="Logo TrueColor" className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 drop-shadow-xl transition-all duration-700" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 animate-slide-right transition-all duration-700 delay-500">
            <span className="text-sm text-gray-200">Creado con <span className="text-pink-400">💗</span> por</span>
            <a
              href="https://devcraftpablo.online/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold underline decoration-wavy decoration-pink-400 text-pink-200 hover:text-pink-300 transition-colors duration-200 drop-shadow-lg"
              aria-label="Web de Pablo Proboste"
            >
              Pablo Proboste
            </a>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 md:mt-0 justify-center animate-slide-right transition-all duration-700 delay-700">
            <a
              href="https://devcraftpablo.online/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-blue-300 text-lg transition-colors duration-200 flex items-center gap-1 animate-fade-in px-2 py-1 rounded-lg hover:bg-white/5"
              title="Web personal"
              aria-label="Web personal"
            >
              <span className="text-xl">🌐</span> Web
            </a>
            <a
              href="https://github.com/31pablo05"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-blue-300 text-lg transition-colors duration-200 flex items-center gap-1 animate-fade-in px-2 py-1 rounded-lg hover:bg-white/5"
              title="GitHub"
              aria-label="GitHub"
            >
              <span className="text-xl">🐙</span> GitHub
            </a>
            <a
              href="mailto:contacto@devcraftpablo.online"
              className="text-blue-200 hover:text-blue-300 text-lg transition-colors duration-200 flex items-center gap-1 animate-fade-in"
              title="Email"
              aria-label="Email"
            >
              <span className="text-xl">✉️</span> Email
            </a>
          </div>
        </div>
  <div className="mt-4 text-xs text-gray-300 text-center animate-fade-in transition-all duration-700 delay-1000">
          &copy; {year} True Color. Todos los derechos reservados. <span className="ml-2">{version}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
