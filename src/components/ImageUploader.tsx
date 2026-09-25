import React, { useRef, useState } from 'react';
import { Upload, X, Calendar, FileText, Image as ImageIcon, ZoomIn, AlertCircle } from 'lucide-react';
import { AttachedImage } from '../types/clinicalCase';

interface ImageUploaderProps {
  images: AttachedImage[];
  onChange: (images: AttachedImage[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<'TAC' | 'RX' | 'RM' | 'Outro'>('TAC');
  const [activeDate, setActiveDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activeNotes, setActiveNotes] = useState<string>('');
  const [zoomImage, setZoomImage] = useState<AttachedImage | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Por favor selecione apenas arquivos de imagem (PNG, JPG, JPEG, WEBP).');
        return;
      }

      // 10MB limit per image
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('O arquivo não pode exceder 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        const newImage: AttachedImage = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: selectedType,
          examDate: activeDate,
          notes: activeNotes || `Imagem de ${selectedType} anexada.`,
          dataUrl,
          fileName: file.name,
        };

        onChange([...images, newImage]);
        setActiveNotes(''); // Reset note for next upload
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const updateImageField = (id: string, field: 'examDate' | 'notes' | 'type', value: string) => {
    onChange(
      images.map((img) => {
        if (img.id === id) {
          return { ...img, [field]: value };
        }
        return img;
      })
    );
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-900 font-semibold mb-2">
          <ImageIcon className="w-5 h-5 text-blue-700" />
          <span>Anexo de Imagens Complementares (TAC / RX / RM)</span>
        </div>
        <p className="text-xs text-blue-700 mb-4">
          Conforme solicitado: anexe os exames radiológicos com data de realização e comentários breves. As imagens serão incorporadas no formulário digital e exportadas diretamente para o documento Word (.docx).
        </p>

        {/* Upload Controls Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-100/50' : 'border-slate-300 bg-white hover:border-blue-400'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Imagem:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="TAC">TAC (Tomografia Axial)</option>
                <option value="RX">RX (Radiografia)</option>
                <option value="RM">RM (Ressonância Magnética)</option>
                <option value="Outro">Outro Exame de Imagem</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data de Realização:</label>
              <input
                type="date"
                value={activeDate}
                onChange={(e) => setActiveDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Comentários / Achados:</label>
              <input
                type="text"
                value={activeNotes}
                onChange={(e) => setActiveNotes(e.target.value)}
                placeholder="Ex: Lesão hipodensa fronto-parietal dta..."
                className="w-full text-sm border border-slate-300 rounded px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="flex flex-col items-center justify-center py-2">
            <Upload className="w-8 h-8 text-blue-600 mb-2 animate-pulse" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Carregar Imagens de {selectedType}
            </button>
            <p className="text-xs text-slate-500 mt-2">
              ou arraste e solte arquivos aqui (JPEG, PNG, WEBP)
            </p>
          </div>

          {errorMsg && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Images List */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Imagens Anexadas ao Caso ({images.length})</span>
            <span className="text-xs text-slate-500 font-normal">Todas as imagens serão exportadas no Word (.docx)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                        #{idx + 1} {img.type}
                      </span>
                      <span className="text-xs text-slate-500 truncate max-w-[150px]" title={img.fileName}>
                        {img.fileName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Remover imagem"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative group bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center h-44 mb-3">
                    <img
                      src={img.dataUrl}
                      alt={`${img.type} ${img.fileName}`}
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setZoomImage(img)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-medium text-xs transition-opacity"
                    >
                      <ZoomIn className="w-5 h-5" />
                      <span>Ampliar Imagem</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-semibold text-slate-600">Data do exame:</span>
                      <input
                        type="date"
                        value={img.examDate}
                        onChange={(e) => updateImageField(img.id, 'examDate', e.target.value)}
                        className="border border-slate-300 rounded px-2 py-0.5 text-xs bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-600 mb-1">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Comentários breves:</span>
                      </div>
                      <textarea
                        rows={2}
                        value={img.notes}
                        onChange={(e) => updateImageField(img.id, 'notes', e.target.value)}
                        placeholder="Insira observações radiológicas relevantes..."
                        className="w-full border border-slate-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">
                  {zoomImage.type} - Data: {zoomImage.examDate || 'Sem data'}
                </h3>
                <p className="text-xs text-slate-500">{zoomImage.fileName}</p>
              </div>
              <button
                type="button"
                onClick={() => setZoomImage(null)}
                className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center overflow-auto flex-1 max-h-[60vh]">
              <img
                src={zoomImage.dataUrl}
                alt={zoomImage.type}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {zoomImage.notes && (
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-700 block mb-1">Comentários:</span>
                <p className="text-sm text-slate-800">{zoomImage.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
