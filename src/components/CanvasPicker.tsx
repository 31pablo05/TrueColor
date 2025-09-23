import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';

interface CanvasPickerProps {
  image: HTMLImageElement | null;
  onColorPick: (rgb: { r: number; g: number; b: number }) => void;
  maxWidth?: number;
  enableZoom?: boolean;
}

const CanvasPicker: React.FC<CanvasPickerProps> = ({ 
  image, 
  onColorPick,
  maxWidth = 800,
  enableZoom = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Touch handling refs
  const pointerTypeRef = useRef<string | null>(null);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isTouchDraggingRef = useRef(false);
  const lastTapTimeRef = useRef<number>(0);
  const TOUCH_MOVE_THRESHOLD = 10;
  const DOUBLE_TAP_DELAY = 300;

  // UI state
  const [zoom, setZoom] = useState<number>(1);
  const [hoverColor, setHoverColor] = useState<{ rgb: string; hex: string } | null>(null);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pickedColor, setPickedColor] = useState<{ rgb: string; hex: string } | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // RGB to Hex converter
  const rgbToHex = useCallback((r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }, []);

  // Get relative canvas coordinates
  const getCanvasPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.max(0, Math.min(canvas.width - 1, Math.round((clientX - rect.left) * scaleX))),
      y: Math.max(0, Math.min(canvas.height - 1, Math.round((clientY - rect.top) * scaleY)))
    };
  }, []);

  // Read pixel color at coordinates
  const readPixel = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    try {
      const data = ctx.getImageData(x, y, 1, 1).data;
      return { r: data[0], g: data[1], b: data[2], a: data[3] };
    } catch (err) {
      console.error('Error reading pixel:', err);
      return null;
    }
  }, []);

  // Handle color selection with feedback
  const handleColorSelection = useCallback((rgb: { r: number; g: number; b: number }) => {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    
    setPickedColor({ rgb: rgbStr, hex });
    onColorPick(rgb);
    
    // Haptic feedback on mobile if available
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Show toast notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, [onColorPick, rgbToHex, isMobile]);

  // Double tap to zoom on mobile
  const handleDoubleTap = useCallback((clientX: number, clientY: number) => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
      if (enableZoom) {
        setZoom(z => z >= 2 ? 1 : 2);
      }
    }
    lastTapTimeRef.current = now;
  }, [enableZoom]);

  // Pointer event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.touchAction = 'none';

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      pointerTypeRef.current = e.pointerType || null;
      
      if (e.pointerType === 'touch') {
        const rect = canvas.getBoundingClientRect();
        touchStartRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        isTouchDraggingRef.current = false;
        handleDoubleTap(e.clientX, e.clientY);
        
        try {
          (e.target as Element).setPointerCapture?.(e.pointerId);
        } catch (err) {
          console.error('Pointer capture failed:', err);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerTypeRef.current === 'touch') {
        const rect = canvas.getBoundingClientRect();
        const dx = Math.abs((e.clientX - rect.left) - touchStartRef.current.x);
        const dy = Math.abs((e.clientY - rect.top) - touchStartRef.current.y);
        if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) {
          isTouchDraggingRef.current = true;
        }
        return;
      }
      
      // Update hover preview for mouse/pen
      if (!isMobile) {
        const rect = canvas.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        setCrosshair({ x: offsetX, y: offsetY });
        
        const pos = getCanvasPos(e.clientX, e.clientY);
        const px = readPixel(pos.x, pos.y);
        if (px) {
          const rgbStr = `rgb(${px.r}, ${px.g}, ${px.b})`;
          const hex = rgbToHex(px.r, px.g, px.b);
          setHoverColor({ rgb: rgbStr, hex });
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const wasTouch = pointerTypeRef.current === 'touch';
      
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch (err) {
        console.error('Pointer release failed:', err);
      }

      if (wasTouch) {
        if (!isTouchDraggingRef.current) {
          const pos = getCanvasPos(e.clientX, e.clientY);
          const px = readPixel(pos.x, pos.y);
          if (px) handleColorSelection({ r: px.r, g: px.g, b: px.b });
        }
      } else {
        const pos = getCanvasPos(e.clientX, e.clientY);
        const px = readPixel(pos.x, pos.y);
        if (px) handleColorSelection({ r: px.r, g: px.g, b: px.b });
      }

      pointerTypeRef.current = null;
      isTouchDraggingRef.current = false;
    };

    const onPointerCancel = () => {
      pointerTypeRef.current = null;
      isTouchDraggingRef.current = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.addEventListener('pointerleave', () => {
      if (!isMobile) {
        setHoverColor(null);
        setCrosshair(null);
      }
    });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [getCanvasPos, readPixel, handleColorSelection, isMobile, rgbToHex, handleDoubleTap]);

  // Draw image on canvas
  useEffect(() => {
    if (image && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        const scale = Math.min(maxWidth / image.width, maxWidth / image.height, 1);
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
      }
    }
  }, [image, maxWidth]);

  // Memoized canvas style
  const canvasStyle = useMemo(() => ({
    maxWidth: '100%',
    height: 'auto',
    transform: `scale(${zoom})`,
    transformOrigin: 'center',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: isMobile ? 'pointer' : 'crosshair'
  }), [zoom, isMobile]);

  if (!image) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-base sm:text-lg font-medium">Sube una imagen para comenzar</p>
          <p className="text-xs sm:text-sm mt-1">
            {isMobile ? 'Toca' : 'Haz clic en'} cualquier píxel para extraer su color
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100">
      {/* Header */}
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
          🎯 Selector de Color
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 px-2">
          {isMobile 
            ? 'Toca la imagen para extraer colores • Doble toque para zoom' 
            : 'Haz clic en cualquier píxel para extraer su color'}
        </p>
      </div>
      
      {/* Canvas Container */}
      <div ref={containerRef} className="relative inline-block mx-auto overflow-hidden rounded-lg sm:rounded-xl">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 sm:border-2 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:border-blue-400 transition-all duration-200"
          style={canvasStyle}
          aria-label="Imagen para selección de color"
        />
        
        {/* Zoom Controls */}
        {enableZoom && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 sm:gap-2 z-10">
            <button
              className="bg-blue-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 shadow-md hover:bg-blue-600 active:scale-95 transition-all duration-150 flex items-center justify-center text-lg sm:text-xl font-bold"
              onClick={() => setZoom(z => Math.min(z + 0.25, 3))}
              aria-label="Acercar"
              disabled={zoom >= 3}
            >
              +
            </button>
            <button
              className="bg-blue-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 shadow-md hover:bg-blue-600 active:scale-95 transition-all duration-150 flex items-center justify-center text-lg sm:text-xl font-bold disabled:opacity-50"
              onClick={() => setZoom(z => Math.max(z - 0.25, 1))}
              aria-label="Alejar"
              disabled={zoom <= 1}
            >
              −
            </button>
            {zoom > 1 && (
              <button
                className="bg-gray-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 shadow-md hover:bg-gray-600 active:scale-95 transition-all duration-150 flex items-center justify-center text-xs font-bold"
                onClick={() => setZoom(1)}
                aria-label="Resetear zoom"
              >
                1:1
              </button>
            )}
          </div>
        )}
        
        {/* Hover Preview (Desktop only) */}
        {!isMobile && hoverColor && crosshair && (
          <>
            <div
              className="absolute pointer-events-none z-20"
              style={{
                left: Math.min(crosshair.x + 15, containerRef.current?.clientWidth ? containerRef.current.clientWidth - 100 : crosshair.x),
                top: Math.max(crosshair.y - 50, 5),
                background: 'white',
                borderRadius: '8px',
                padding: '6px 10px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '11px',
                fontFamily: 'monospace',
                minWidth: '80px'
              }}
            >
              <div style={{ background: hoverColor.rgb, width: '100%', height: '20px', borderRadius: '4px', marginBottom: '4px' }} />
              <div>{hoverColor.hex}</div>
            </div>
            <div
              className="absolute pointer-events-none"
              style={{
                left: crosshair.x - 10,
                top: crosshair.y - 10,
                width: 20,
                height: 20,
                border: '2px solid #3b82f6',
                borderRadius: '50%',
                boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
          </>
        )}
      </div>
      
      {/* Color Display */}
      {pickedColor && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-300 shadow-inner"
              style={{ background: pickedColor.rgb }}
              aria-label="Color seleccionado"
            />
            <div className="text-xs sm:text-sm">
              <div className="font-mono font-semibold">{pickedColor.hex}</div>
              <div className="font-mono text-gray-600">{pickedColor.rgb}</div>
            </div>
          </div>
          <button
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 active:scale-95 transition-all duration-150"
            onClick={() => {
              navigator.clipboard.writeText(pickedColor.hex);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }}
          >
            Copiar HEX
          </button>
        </div>
      )}
      
      {/* Tips */}
      <div className="mt-3 sm:mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 rounded-lg">
          <span className="text-xs sm:text-sm font-medium text-blue-700">
            💡 {isMobile 
              ? `Zoom: ${(zoom * 100).toFixed(0)}% • Doble toque para ${zoom === 1 ? 'acercar' : 'alejar'}`
              : `Zoom: ${(zoom * 100).toFixed(0)}% • Usa los controles para mayor precisión`}
          </span>
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in text-sm">
          {pickedColor ? '¡Color copiado!' : '¡Color seleccionado!'}
        </div>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CanvasPicker;