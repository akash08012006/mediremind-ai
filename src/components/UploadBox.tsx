import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, File, AlertCircle, RefreshCw, CheckCircle2, XCircle, Info, Loader2 } from 'lucide-react';

interface UploadBoxProps {
  onFileUploaded: (file: { name: string; size: string }) => void;
  disabled?: boolean;
}

export default function UploadBox({ onFileUploaded, disabled }: UploadBoxProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || uploadStatus === 'uploading') return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const sizeInKB = (file.size / 1024).toFixed(1);
    const fileData = {
      name: file.name,
      size: `${sizeInKB} KB`,
    };
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    setSelectedFile(null);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadStatus('success');
            setSelectedFile(fileData);
            onFileUploaded(fileData);
          }, 300);
          return 100;
        }
        return prev + Math.random() * 25 + 10;
      });
    }, 250);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || uploadStatus === 'uploading') return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled || uploadStatus === 'uploading') return;

    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (disabled || uploadStatus === 'uploading') return;
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getBorderColor = () => {
    if (uploadStatus === 'success') return 'border-emerald-400';
    if (uploadStatus === 'error') return 'border-red-400';
    if (dragActive) return 'border-blue-500';
    return 'border-slate-200';
  };

  const getBgColor = () => {
    if (uploadStatus === 'success') return 'bg-emerald-50/60';
    if (uploadStatus === 'error') return 'bg-red-50/60';
    if (dragActive) return 'bg-blue-50/60';
    return 'bg-slate-50/40';
  };

  return (
    <div className="w-full" id="upload-box-wrapper">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`
          relative w-full border-2 rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-500 ease-out
          flex flex-col items-center justify-center gap-4
          hover:shadow-lg
          ${getBorderColor()}
          ${getBgColor()}
          ${disabled || uploadStatus === 'uploading' ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleChange}
          disabled={disabled || uploadStatus === 'uploading'}
        />

        {uploadStatus === 'uploading' && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-5 z-10">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="none"
                  className="text-slate-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  className="text-blue-600 transition-all duration-300"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 44}`,
                    strokeDashoffset: `${2 * Math.PI * 44 * (1 - Math.min(uploadProgress, 100) / 100)}`
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-slate-700">{Math.round(uploadProgress)}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-700">Uploading prescription...</p>
            </div>
          </div>
        )}

        {uploadStatus === 'success' && selectedFile ? (
          <div className="space-y-5 w-full max-w-sm animate-in fade-in zoom-in duration-700">
            <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center relative">
              <CheckCircle2 className="w-10 h-10" />
              <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
              <div className="absolute -inset-3 rounded-full bg-emerald-400/20 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <p className="text-base font-bold text-slate-800 truncate" title={selectedFile.name}>
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">{selectedFile.size}</p>
            </div>

            <div className="flex items-center justify-center gap-2 p-3 bg-emerald-100/80 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-xs font-semibold text-emerald-800">Prescription uploaded successfully</p>
            </div>

            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Upload Different File
            </button>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="space-y-4 w-full max-w-sm">
            <div className="mx-auto h-20 w-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <XCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <p className="text-base font-bold text-slate-800">Upload Failed</p>
              <p className="text-xs text-slate-500">Please try again with a valid file</p>
            </div>
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        ) : (
          <>
            <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              dragActive 
                ? 'bg-blue-100 text-blue-600 scale-110' 
                : 'bg-blue-50 text-blue-600'
            }`}>
              <UploadCloud className={`w-8 h-8 transition-all duration-300 ${dragActive ? 'scale-110' : 'animate-bounce'}`} />
            </div>

            <div className="space-y-2 text-center">
              <p className="text-base font-bold text-slate-800">
                {dragActive ? 'Drop your prescription here' : 'Drag and drop your prescription here'}
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Supports medical scan images, photos, or PDF up to 5MB
              </p>
            </div>

            <button
              type="button"
              onClick={onButtonClick}
              className="mt-2 px-6 py-2.5 rounded-full bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-blue-300 text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Select File From Device
            </button>
          </>
        )}
      </div>

      {/* OCR Simulator hint */}
      <div className={`mt-4 flex items-start gap-2 text-xs p-3 rounded-xl border transition-all duration-300 ${
        uploadStatus === 'success' 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
          : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        {uploadStatus === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
        ) : (
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        )}
        <p className="leading-relaxed">
          <span className="font-bold">OCR Simulation Ready:</span> Once a file is selected, click "Extract Demo Prescription" to trigger AI-based OCR analysis and see scan quality results.
        </p>
      </div>
    </div>
  );
}
