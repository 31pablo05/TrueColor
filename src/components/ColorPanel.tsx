import React, { useState } from 'react';

interface ColorPanelProps {
  hex: string;
  rgb: string;
  hsl: string;
  onCopy: (value: string) => void;
}

const ColorPanel: React.FC<ColorPanelProps> = ({ hex, rgb, hsl, onCopy }) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const handleCopy = async (value: string, format: string) => {
    await onCopy(value);
    setCopiedValue(format);
    setShowToast(true);
    setTimeout(() => {
      setCopiedValue(null);
      setShowToast(false);
    }, 1800);
  };

  const ColorValue: React.FC<{ label: string; value: string; format: string }> = ({ label, value, format }) => (
    <div className="group">
      <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-xl rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg border border-gray-100">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
          <div className="font-mono text-lg text-gray-900 select-all">{value}</div>
        </div>
        <button
          onClick={() => handleCopy(value, format)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            copiedValue === format
              ? 'bg-green-500 text-white animate-pop'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          aria-label={`Copiar valor ${label}`}
        >
          {copiedValue === format ? <span>✓</span> : <span>📋</span>}
          <span className="hidden sm:inline">{copiedValue === format ? 'Copiado' : 'Copiar'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 animate-slide-up">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span>🎨 Color Extraído</span>
          <button
            className={`ml-2 p-2 rounded-full border-2 ${favorite ? 'border-yellow-400 bg-yellow-100' : 'border-gray-200 bg-white'} shadow transition-all duration-200`}
            onClick={() => setFavorite(f => !f)}
            aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            title={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {favorite ? '★' : '☆'}
          </button>
        </h3>
        <p className="text-gray-600">Aquí están todos los formatos del color seleccionado</p>
      </div>

      {/* Color Preview mejorado */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div 
            className="w-28 h-28 rounded-2xl shadow-2xl border-4 border-white/80 animate-fade-in"
            style={{ background: hex }}
          />
          <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200">
            <div 
              className="w-6 h-6 rounded-full border border-gray-200"
              style={{ background: hex }}
            />
          </div>
          {/* Contraste con fondo blanco y negro */}
          <div className="absolute -bottom-3 left-0 flex gap-2">
            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center" style={{ background: '#fff' }}>
              <div className="w-5 h-5 rounded-full" style={{ background: hex, border: '1px solid #eee' }} />
            </div>
            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center" style={{ background: '#222' }}>
              <div className="w-5 h-5 rounded-full" style={{ background: hex, border: '1px solid #222' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Color Values */}
      <div className="space-y-4">
        <ColorValue label="HEX" value={hex} format="hex" />
        <ColorValue label="RGB" value={rgb} format="rgb" />
        <ColorValue label="HSL" value={hsl} format="hsl" />
      </div>

      {/* Feedback visual al copiar */}
      {showToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-pop">
          ¡Valor copiado!
        </div>
      )}

      {/* Controles avanzados */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <button
          className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition-all duration-200"
          title="Ajustar tono (próximamente)"
          disabled
        >
          Ajustar tono
        </button>
        <button
          className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition-all duration-200"
          title="Ver sugerencias de accesibilidad (próximamente)"
          disabled
        >
          Accesibilidad
        </button>
      </div>

      {/* Info adicional */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-center gap-2 text-blue-700">
          <span className="text-sm font-medium">💡 Los valores se copian automáticamente al portapapeles</span>
        </div>
      </div>
    </div>
  );
};

export default ColorPanel;
