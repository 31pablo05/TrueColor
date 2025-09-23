import React, { useRef, useEffect, useState } from 'react';

interface CanvasPickerProps {
  image: HTMLImageElement | null;
  onColorPick: (rgb: { r: number; g: number; b: number }) => void;
}

const CanvasPicker: React.FC<CanvasPickerProps> = ({ image, onColorPick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (image && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const maxWidth = 800;
        const scale = Math.min(maxWidth / image.width, maxWidth / image.height, 1) * zoom;
        canvasRef.current.width = image.width * scale;
        canvasRef.current.height = image.height * scale;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [image, zoom]);

  const handlePick = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let x = 0, y = 0;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    // Adjust for device pixel ratio
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    x *= scaleX;
    y *= scaleY;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const data = ctx.getImageData(x, y, 1, 1).data;
      onColorPick({ r: data[0], g: data[1], b: data[2] });
      setCrosshair({ x: x / scaleX, y: y / scaleY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCrosshair({ x, y });
    // Preview color en hover
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const data = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data;
      setHoverColor(`rgb(${data[0]}, ${data[1]}, ${data[2]})`);
    }
  };

  const handleMouseLeave = () => {
  setCrosshair(null);
  setHoverColor(null);
  };

  if (!image) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">Sube una imagen para comenzar</p>
          <p className="text-sm">Haz clic en cualquier píxel para extraer su color</p>
        </div>
      </div>
    );
  }

  return (
  <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl border border-gray-100 animate-slide-up">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">🎯 Selector de Color</h3>
        <p className="text-gray-600">Haz clic en cualquier píxel de la imagen para extraer su color</p>
      </div>
      
      <div className="relative inline-block mx-auto">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-200 rounded-xl shadow-lg cursor-crosshair max-w-full h-auto hover:border-blue-400 transition-colors duration-200"
          onClick={handlePick}
          onTouchStart={handlePick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ maxWidth: '100%', height: 'auto', transition: 'transform 0.3s' , transform: `scale(${zoom})` }}
        />
        {/* Zoom controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          <button
            className="bg-blue-500 text-white rounded-full p-1 sm:p-2 shadow hover:bg-blue-600 transition-colors duration-200"
            onClick={() => setZoom(z => Math.min(z + 0.2, 3))}
            title="Acercar"
          >
            +
          </button>
          <button
            className="bg-blue-500 text-white rounded-full p-1 sm:p-2 shadow hover:bg-blue-600 transition-colors duration-200"
            onClick={() => setZoom(z => Math.max(z - 0.2, 1))}
            title="Alejar"
          >
            -
          </button>
        </div>
        {/* Preview de color en hover */}
        {hoverColor && crosshair && (
          <div
            className="absolute pointer-events-none animate-fade-in"
            style={{
              left: crosshair.x + 24,
              top: crosshair.y - 24,
              background: hoverColor,
              borderRadius: '50%',
              width: 32,
              height: 32,
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#222',
              fontSize: 12,
              zIndex: 20,
            }}
          >
            {/* Puedes mostrar el valor RGB si quieres */}
          </div>
        )}
        {/* Crosshair animado */}
        {crosshair && (
          <div
            className="absolute pointer-events-none animate-pulse-slow"
            style={{
              left: crosshair.x - 10,
              top: crosshair.y - 10,
              width: 20,
              height: 20,
              border: '2px solid #3b82f6',
              borderRadius: '50%',
              boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
            }}
          />
        )}
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg text-blue-700">
          <span className="text-sm font-medium">💡 Tip: Usa zoom en tu navegador para mayor precisión</span>
        </div>
      </div>
    </div>
  );
};

export default CanvasPicker;
