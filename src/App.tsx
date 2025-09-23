import React, { useState, useEffect, useCallback } from 'react';
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

interface ColorState {
  r: number;
  g: number;
  b: number;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'info' | 'warning';
}

const App: React.FC = () => {
  // Estados principales
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showTip, setShowTip] = useState(true);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [color, setColor] = useState<ColorState | null>(null);
  const [previousColor, setPreviousColor] = useState<ColorState | null>(null);
  const [history, setHistory] = useLocalStorage<string[]>('colorHistory', []);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info'
  });

  // Efecto para el tema
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail === 'light' || e.detail === 'dark') {
        setTheme(e.detail);
      }
    };
    window.addEventListener('setTheme', handler as EventListener);
    return () => window.removeEventListener('setTheme', handler as EventListener);
  }, []);

  // Efecto para el tip automático mejorado
  useEffect(() => {
    if (showTip && !image) {
      const timer = setTimeout(() => {
        setShowTip(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showTip, image]);

  // Efecto para ocultar el tip cuando se carga una imagen
  useEffect(() => {
    if (image) {
      setShowTip(false);
    }
  }, [image]);

  // Función para mostrar notificaciones
  const showNotification = useCallback((message: string, type: NotificationState['type'] = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  const handleImageLoad = useCallback((img: HTMLImageElement) => {
    setImage(img);
    showNotification('¡Imagen cargada! Haz clic en cualquier parte para extraer colores.', 'success');
  }, [showNotification]);

  const handleColorPick = useCallback((rgb: ColorState) => {
    setIsTransitioning(true);
    setPreviousColor(color);
    
    setTimeout(() => {
      setColor(rgb);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setHistory([hex, ...history.filter(h => h !== hex)].slice(0, 20));
      setIsTransitioning(false);
      showNotification(`Color extraído: ${hex}`, 'success');
    }, 150);
  }, [color, history, setHistory, showNotification]);

  const handleHistorySelect = useCallback((hex: string) => {
    if (hex === 'clear-history') {
      setHistory([]);
      setColor(null);
      setPreviousColor(null);
      showNotification('Historial limpiado', 'info');
      return;
    }
    
    if (hex.startsWith('delete-')) {
      const idx = parseInt(hex.replace('delete-', ''), 10);
      if (!isNaN(idx)) {
        setHistory(history.filter((_, i) => i !== idx));
        showNotification('Color eliminado del historial', 'info');
      }
      return;
    }
    
    const rgb = hexToRgb(hex);
    if (rgb) {
      setIsTransitioning(true);
      setPreviousColor(color);
      setTimeout(() => {
        setColor(rgb);
        setIsTransitioning(false);
      }, 150);
    }
  }, [history, setHistory, color, showNotification]);

  const handleCopy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showNotification(`Copiado: ${value}`, 'success');
    } catch (err) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = value;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNotification(`Copiado: ${value}`, 'success');
    }
  }, [showNotification]);

  // Cálculo de valores de color
  const colorValues = React.useMemo(() => {
    if (!color) return { hex: '', rgbStr: '', hsl: '' };
    
    return {
      hex: rgbToHex(color.r, color.g, color.b),
      rgbStr: `rgb(${color.r}, ${color.g}, ${color.b})`,
      hsl: rgbToHsl(color.r, color.g, color.b)
    };
  }, [color]);

  // Cálculo del gradiente de fondo mejorado
  const backgroundGradient = React.useMemo(() => {
    if (color) {
      const { hex } = colorValues;
      // Crear colores complementarios y análogos
      const rgb = color;
      const complementaryR = 255 - rgb.r;
      const complementaryG = 255 - rgb.g;
      const complementaryB = 255 - rgb.b;
      const complementary = rgbToHex(complementaryR, complementaryG, complementaryB);
      
      return `linear-gradient(135deg, 
        ${hex}15 0%, 
        ${complementary}20 25%, 
        ${hex}10 50%, 
        ${complementary}15 75%, 
        ${hex}20 100%)`;
    }
    
    return theme === 'dark'
      ? 'linear-gradient(135deg, #1a1a2e15, #16213e20, #0f3460 15, #533483 10, #eee2dc 15)'
      : 'linear-gradient(135deg, #ff6b6b10, #feca5715, #48dbfb10, #1dd1a115, #5f27cd10)';
  }, [color, colorValues, theme]);

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-all duration-500 ${
      theme === 'dark' ? 'theme-dark' : 'theme-light'
    }`}>
      {/* Fondo animado mejorado */}
      <div
        className="fixed inset-0 -z-20 transition-all duration-1000 ease-out"
        style={{
          background: backgroundGradient,
          animation: 'gradientShift 15s ease infinite'
        }}
      />
      
      {/* Partículas de fondo opcionales */}
      <div className="fixed inset-0 -z-10 opacity-30">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: color ? `${colorValues.hex}20` : '#ffffff10',
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Notificaciones mejoradas */}
      {notification.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border-2 ${
            notification.type === 'success' 
              ? 'bg-green-500/20 border-green-400/50 text-green-800' 
              : notification.type === 'warning'
              ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-800'
              : 'bg-blue-500/20 border-blue-400/50 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tip mejorado */}
      {showTip && (
        <div className="fixed left-1/2 bottom-24 z-40 -translate-x-1/2 animate-bounce-gentle">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl px-6 py-4 flex items-center gap-4 border-2 border-pink-200 dark:border-pink-600 backdrop-blur-xl">
            {/* Mascota SVG mejorada */}
            <div className="animate-pulse-gentle">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="16" cy="14" rx="12" ry="8" fill="url(#paint0_radial)" />
                <ellipse cx="16" cy="24" rx="7" ry="4" fill={theme === 'dark' ? '#4a5568' : '#ffffff'} />
                <circle cx="11" cy="13" r="2" fill="#ff6b6b" className="animate-twinkle" />
                <circle cx="21" cy="15" r="2" fill="#48dbfb" className="animate-twinkle" style={{ animationDelay: '0.5s' }} />
                <circle cx="16" cy="10" r="2" fill="#feca57" className="animate-twinkle" style={{ animationDelay: '1s' }} />
                <defs>
                  <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(16 14) scale(12 8)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff6b6b" />
                    <stop offset="0.5" stopColor="#48dbfb" />
                    <stop offset="1" stopColor="#5f27cd" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                💡 Sube una imagen y haz clic para extraer colores
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ¡Descubre la paleta perfecta!
              </p>
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Header theme={theme} onThemeChange={setTheme} />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section mejorado */}
          {!image && (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-8xl mb-6 animate-float">🎨</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Extractor de Colores Inteligente
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Sube una imagen, haz clic en cualquier píxel y obtén instantáneamente 
                los valores <span className="font-semibold text-purple-600">HEX</span>, 
                <span className="font-semibold text-pink-600"> RGB</span> y 
                <span className="font-semibold text-blue-600"> HSL</span> del color.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span>🎯</span> Precisión perfecta
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span> Extracción instantánea
                </div>
                <div className="flex items-center gap-2">
                  <span>🎪</span> Historial inteligente
                </div>
              </div>
            </div>
          )}

          {/* Layout principal con transiciones mejoradas */}
          <div className={`transition-all duration-700 ease-out ${
            image ? 'opacity-100 transform-none' : 'opacity-90'
          }`}>
            
            {/* Sección de upload y panel de color */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="order-2 lg:order-1">
                <Upload onImageLoad={handleImageLoad} />
              </div>
              
              {color && (
                <div className={`order-1 lg:order-2 transition-all duration-500 ${
                  isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                }`}>
                  <ColorPanel 
                    hex={colorValues.hex} 
                    rgb={colorValues.rgbStr} 
                    hsl={colorValues.hsl} 
                    onCopy={handleCopy}
                    previousColor={previousColor ? rgbToHex(previousColor.r, previousColor.g, previousColor.b) : undefined}
                  />
                </div>
              )}
            </div>

            {/* Canvas picker */}
            {image && (
              <div className="mt-12 animate-slide-up">
                <CanvasPicker image={image} onColorPick={handleColorPick} />
              </div>
            )}
            
            {/* Historial de colores */}
            {history.length > 0 && (
              <div className="mt-12 animate-fade-in">
                <ColorHistory colors={history} onSelect={handleHistorySelect} />
              </div>
            )}
            
            {/* Gestor de paletas */}
            {history.length > 0 && (
              <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <PaletteManager currentColors={history.slice(0, 8)} />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;