import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Upload from './components/Upload';
import CanvasPicker from './components/CanvasPicker';
import ColorPanel from './components/ColorPanel';
import ColorHistory from './components/ColorHistory';
import PaletteManager from './components/PaletteManager';
import { rgbToHex, rgbToHsl, hexToRgb } from './utils/colorUtils';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showTip, setShowTip] = useState(true);
  // Tip flotante automático
  React.useEffect(() => {
    if (showTip) {
      const timer = setTimeout(() => setShowTip(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showTip]);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [color, setColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [history, setHistory] = useLocalStorage<string[]>('colorHistory', []);

  const handleImageLoad = (img: HTMLImageElement) => {
    setImage(img);
  };

  const handleColorPick = (rgb: { r: number; g: number; b: number }) => {
    setColor(rgb);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHistory([hex, ...history.filter(h => h !== hex)].slice(0, 20));
  };

  const handleHistorySelect = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) setColor(rgb);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  let hex = '', rgbStr = '', hsl = '';
  if (color) {
    hex = rgbToHex(color.r, color.g, color.b);
    rgbStr = `rgb(${color.r}, ${color.g}, ${color.b})`;
    hsl = rgbToHsl(color.r, color.g, color.b);
  }

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Fondo animado reactivo al color seleccionado, cubre toda la web */}
      <div
        className={`fixed inset-0 -z-10 animate-gradient-bg transition-all duration-700`}
        style={{
          pointerEvents: 'none',
          background: color
            ? `linear-gradient(120deg, ${hex} 0%, ${hex} 30%, #feca57 50%, #48dbfb 70%, #1dd1a1 85%, #5f27cd 100%)`
            : theme === 'dark'
              ? 'linear-gradient(120deg, #232526, #414345, #1a2980, #26d0ce, #1e130c, #000428, #004e92)'
              : 'linear-gradient(120deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1, #5f27cd, #ee5253, #00d2d3)',
          opacity: color ? 0.35 : 0.18,
        }}
      ></div>
      {/* Mascota/asistente visual: honguito de colores y tip flotante */}
      {showTip && (
        <div className="fixed left-1/2 bottom-24 z-[100] -translate-x-1/2 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-3 border-2 border-pink-200 backdrop-blur-md">
            {/* Honguito de colores SVG */}
            <span className="text-3xl animate-bounce">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="16" cy="14" rx="12" ry="8" fill="url(#paint0_radial)" />
                <ellipse cx="16" cy="24" rx="7" ry="4" fill="#fff" />
                <circle cx="11" cy="13" r="2" fill="#ff6b6b" />
                <circle cx="21" cy="15" r="2" fill="#48dbfb" />
                <circle cx="16" cy="10" r="2" fill="#feca57" />
                <defs>
                  <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(16 14) scale(12 8)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff6b6b" />
                    <stop offset="0.5" stopColor="#48dbfb" />
                    <stop offset="1" stopColor="#5f27cd" />
                  </radialGradient>
                </defs>
              </svg>
            </span>
            <span className="text-base font-semibold text-gray-700">Tip: Haz clic en la imagen para extraer el color</span>
          </div>
        </div>
      )}
      {/* Botón de tema oscuro/día funcional */}
      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <button
          className={`bg-white/80 rounded-full shadow-lg p-2 text-xl hover:bg-gray-200 transition-colors duration-200 ${theme === 'light' ? 'ring-2 ring-blue-400' : ''}`}
          title="Tema claro"
          onClick={() => setTheme('light')}
        >
          🌞
        </button>
        <button
          className={`bg-gray-900/80 rounded-full shadow-lg p-2 text-xl text-yellow-300 hover:bg-gray-800 transition-colors duration-200 ${theme === 'dark' ? 'ring-2 ring-yellow-400' : ''}`}
          title="Tema oscuro"
          onClick={() => setTheme('dark')}
        >
          🌙
        </button>
      </div>
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          {!image && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Extrae colores perfectos de cualquier imagen
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Sube una imagen, haz clic en cualquier píxel y obtén instantáneamente 
                los valores HEX, RGB y HSL del color. Perfecto para diseñadores, 
                desarrolladores y creativos.
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
            <div className="flex-1">
              <Upload onImageLoad={handleImageLoad} />
            </div>
            {color && (
              <div className="flex-1">
                <ColorPanel hex={hex} rgb={rgbStr} hsl={hsl} onCopy={handleCopy} />
              </div>
            )}
          </div>
          {image && (
            <div className="mt-8">
              <CanvasPicker image={image} onColorPick={handleColorPick} />
            </div>
          )}
          
          {color && <ColorPanel hex={hex} rgb={rgbStr} hsl={hsl} onCopy={handleCopy} />}
          
          <ColorHistory colors={history} onSelect={handleHistorySelect} />
          
          <PaletteManager currentColors={history.slice(0, 8)} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
