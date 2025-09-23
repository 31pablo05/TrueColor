import React, { useRef, useState } from 'react';

interface UploadProps {
  onImageLoad: (img: HTMLImageElement) => void;
}

const Upload: React.FC<UploadProps> = ({ onImageLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('La imagen no debe superar los 10MB.');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.src = ev.target?.result as string;
      img.onload = () => onImageLoad(img);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlPaste = () => {
    const url = urlInputRef.current?.value;
    if (url) {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => onImageLoad(img);
      img.onerror = () => alert('Error al cargar la imagen desde la URL');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no debe superar los 10MB.');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
  <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl border border-gray-100 animate-slide-up">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sube tu imagen</h2>
        <p className="text-gray-600">Arrastra una imagen, selecciona un archivo o pega una URL</p>
        {error && (
          <div className="mt-2 text-red-500 text-sm animate-pulse-slow">{error}</div>
        )}
      </div>
      
      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300 ${
          dragOver 
            ? 'border-blue-500 bg-blue-50 animate-pulse-slow' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400 animate-bounce" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {preview && (
          <div className="mb-4 flex flex-col items-center">
            <img src={preview} alt="Preview" className="max-h-40 sm:max-h-48 rounded-xl shadow-lg border-2 border-blue-200 animate-fade-in" />
            <button
              className="mt-2 w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
              onClick={() => {
                const img = new window.Image();
                img.src = preview;
                img.onload = () => onImageLoad(img);
              }}
            >
              Usar esta imagen
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        
        <label 
          htmlFor="file-upload"
          className="cursor-pointer inline-flex w-full sm:w-auto justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          📂 Seleccionar archivo
        </label>
        
        <p className="mt-2 text-sm text-gray-500">PNG, JPG, GIF hasta 10MB</p>
      </div>

      {/* URL Input */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            ref={urlInputRef}
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          />
          <button
            onClick={handleUrlPaste}
            className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
          >
            🔗 Cargar URL
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
