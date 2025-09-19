import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const version = 'v1.0.0';
  return (
    <footer className="w-full py-8 bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 text-white mt-auto shadow-2xl backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full animate-fade-in">
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <span className="text-2xl animate-fade-in" aria-label="Brillo">28</span>
            <span className="text-lg font-bold tracking-wide animate-gradient-x bg-gradient-to-r from-blue-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              True Color
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-200">Creado con <span className="animate-pulse text-pink-400">💗</span> por</span>
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
          <div className="flex gap-4 mt-2 md:mt-0">
            <a
              href="https://devcraftpablo.online/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-blue-300 text-lg transition-colors duration-200 flex items-center gap-1"
              title="Web personal"
              aria-label="Web personal"
            >
              <span className="text-xl">🌐</span> Web
            </a>
            <a
              href="https://github.com/31pablo05"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-blue-300 text-lg transition-colors duration-200 flex items-center gap-1"
              title="GitHub"
              aria-label="GitHub"
            >
              <span className="text-xl">🐙</span> GitHub
            </a>
            <a
              href="mailto:contacto@devcraftpablo.online"
              className="text-blue-200 hover:text-blue-300 text-lg transition-colors duration-200 flex items-center gap-1"
              title="Email"
              aria-label="Email"
            >
              <span className="text-xl">✉️</span> Email
            </a>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-300 text-center">
          &copy; {year} True Color. Todos los derechos reservados. <span className="ml-2">{version}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
