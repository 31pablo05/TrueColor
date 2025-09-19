import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.tsx';

interface Palette {
  name: string;
  colors: string[];
  createdAt: string;
}

interface PaletteManagerProps {
  currentColors?: string[];
}

const PaletteManager: React.FC<PaletteManagerProps> = ({ currentColors = [] }) => {
  const [palettes, setPalettes] = useLocalStorage<Palette[]>('palettes', []);
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const savePalette = () => {
    if (name.trim() && currentColors.length > 0) {
      const newPalette: Palette = {
        name: name.trim(),
        colors: [...currentColors],
        createdAt: new Date().toLocaleDateString()
      };
      setPalettes([newPalette, ...palettes]);
      setName('');
      setIsCreating(false);
      setShowToast(true);
      setCopied('palette');
      setTimeout(() => { setShowToast(false); setCopied(null); }, 1500);
    }
  };

  const deletePalette = (index: number) => {
    if (window.confirm('¿Seguro que quieres eliminar esta paleta?')) {
      const newPalettes = palettes.filter((_: Palette, idx: number) => idx !== index);
      setPalettes(newPalettes);
      setShowToast(true);
      setCopied('delete');
      setTimeout(() => { setShowToast(false); setCopied(null); }, 1200);
    }
  };

  const copyPalette = (colors: string[]) => {
  const paletteText = colors.join(', ');
  navigator.clipboard.writeText(paletteText);
  setShowToast(true);
  setCopied('palette');
  setTimeout(() => { setShowToast(false); setCopied(null); }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 animate-slide-up">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2 justify-center">
          <span>🎨 Gestor de Paletas</span>
        </h3>
        <p className="text-gray-600">Guarda y organiza tus paletas de colores favoritas</p>
      </div>

      {/* Feedback visual al copiar/eliminar/guardar */}
      {showToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-pop">
          {copied === 'palette' ? '¡Paleta copiada/guardada!' : copied === 'delete' ? 'Paleta eliminada' : '¡Color copiado!'}
        </div>
      )}

      {/* Create Palette Section */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 shadow-lg">
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            disabled={currentColors.length === 0}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              currentColors.length > 0
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            ➕ Nueva Paleta {currentColors.length > 0 ? `(${currentColors.length} colores)` : ''}
          </button>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la paleta (ej: 'Sunset Colors')"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={savePalette}
                disabled={!name.trim()}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  name.trim()
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ✓ Guardar
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setName('');
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
              >
                ✕ Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Palettes List */}
      <div className="space-y-4">
        {palettes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 animate-fade-in">
            <div className="text-4xl mb-2">🎨</div>
            <p>No hay paletas guardadas aún</p>
            <p className="text-sm">Crea tu primera paleta seleccionando algunos colores</p>
          </div>
        ) : (
          palettes.map((palette: Palette, idx: number) => (
            <div key={idx} className="p-4 bg-white/60 backdrop-blur-xl rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg border border-gray-100 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    {palette.name}
                    <button
                      className={`ml-1 p-1 rounded-full border-2 ${favorites.includes(idx) ? 'border-yellow-400 bg-yellow-100' : 'border-gray-200 bg-white'} shadow transition-all duration-200`}
                      onClick={() => setFavorites(favs => favs.includes(idx) ? favs.filter(i => i !== idx) : [...favs, idx])}
                      title={favorites.includes(idx) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      aria-label={favorites.includes(idx) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      {favorites.includes(idx) ? '★' : '☆'}
                    </button>
                  </h4>
                  <p className="text-xs text-gray-500">Creada el {palette.createdAt}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyPalette(palette.colors)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-all duration-200"
                    title="Copiar colores"
                    aria-label="Copiar colores"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => deletePalette(idx)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-all duration-200"
                    title="Eliminar paleta"
                    aria-label="Eliminar paleta"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              {/* Scroll horizontal en mobile */}
              <div className="flex gap-2 flex-wrap overflow-x-auto pb-2">
                {palette.colors.map((color: string, colorIdx: number) => (
                  <button
                    key={colorIdx}
                    className="w-8 h-8 rounded-lg shadow-sm border-2 border-white cursor-pointer hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    style={{ background: color }}
                    title={color}
                    aria-label={`Copiar color ${color}`}
                    onClick={() => {
                      navigator.clipboard.writeText(color);
                      setShowToast(true);
                      setCopied(color);
                      setTimeout(() => { setShowToast(false); setCopied(null); }, 1000);
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Info adicional y favoritos */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-center gap-2 text-blue-700">
          <span className="text-sm font-medium">💡 Haz clic en un color para copiarlo. Puedes marcar paletas favoritas.</span>
          {favorites.length > 0 && <span className="text-yellow-500">★ {favorites.length} favorito{favorites.length !== 1 ? 's' : ''}</span>}
        </div>
      </div>
    </div>
  );
};

export default PaletteManager;
