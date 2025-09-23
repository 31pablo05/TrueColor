import React from 'react';

interface ColorHistoryProps {
  colors: string[];
  onSelect: (color: string) => void;
}

const ColorHistory: React.FC<ColorHistoryProps> = ({ colors, onSelect }) => {
  const [showClear, setShowClear] = React.useState(false);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const handleFavorite = (color: string) => {
    setFavorites(favs => favs.includes(color) ? favs.filter(c => c !== color) : [...favs, color]);
  };
  const handleClear = () => {
    if (window.confirm('¿Seguro que quieres borrar el historial de colores?')) {
      onSelect('clear-history');
    }
  };
  if (colors.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📚 Historial de Colores</h3>
          <p className="text-gray-500">Los colores que selecciones aparecerán aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 animate-slide-up">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="text-center flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2 justify-center">
            <span>📚 Historial de Colores</span>
            <button
              className="p-2 rounded-full border-2 border-gray-200 bg-white shadow hover:bg-red-100 transition-all duration-200"
              onClick={handleClear}
              title="Borrar historial"
              aria-label="Borrar historial"
            >🗑️</button>
          </h3>
          <p className="text-gray-600">Haz clic en cualquier color para volver a seleccionarlo</p>
        </div>
      </div>
      {/* Scroll horizontal en mobile */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3 min-w-max">
          {colors.map((color, idx) => (
            <div key={idx} className="relative group animate-fade-in">
              <button
                className="w-14 h-14 sm:w-12 sm:h-12 rounded-xl shadow-md border-2 border-white hover:border-blue-400 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                style={{ background: color }}
                onClick={() => onSelect(color)}
                title={color}
                aria-label={`Seleccionar color ${color}`}
              >
                <div className="absolute inset-0 rounded-xl bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
              </button>
              {/* Favoritos */}
              <button
                className={`absolute -top-2 -left-2 w-6 h-6 rounded-full border-2 ${favorites.includes(color) ? 'border-yellow-400 bg-yellow-100' : 'border-gray-200 bg-white'} shadow flex items-center justify-center text-lg transition-all duration-200`}
                onClick={() => handleFavorite(color)}
                title={favorites.includes(color) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                aria-label={favorites.includes(color) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                {favorites.includes(color) ? '★' : '☆'}
              </button>
              {/* Borrar color individual */}
              <button
                className="absolute top-1 right-1 w-7 h-7 rounded-full border-2 border-red-400 bg-white shadow flex items-center justify-center text-xl transition-all duration-200 hover:bg-red-100 z-10"
                onClick={() => onSelect(`delete-${idx}`)}
                title="Eliminar color"
                aria-label="Eliminar color"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-600 text-sm animate-fade-in">
          <span>{colors.length} color{colors.length !== 1 ? 'es' : ''} guardado{colors.length !== 1 ? 's' : ''}</span>
          {favorites.length > 0 && <span className="text-yellow-500">★ {favorites.length} favorito{favorites.length !== 1 ? 's' : ''}</span>}
        </div>
      </div>
    </div>
  );
};

export default ColorHistory;
